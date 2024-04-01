import { Types } from 'mongoose';
import { ITodoList } from '../../entity-interfaces/todo-list.interface';
import { BaseRepository } from '../base.repository';
import TodoListSchema from './todo-list.schema';
import { ITodoItem } from '../../entity-interfaces/todo-item.interface';

class TodoListRepository extends BaseRepository<ITodoList> {
  constructor() {
    super(TodoListSchema);
  }

  public async createItemsByIds(
    id: string,
    items: ITodoItem[],
  ): Promise<ITodoItem[]> {
    const _id = new Types.ObjectId(id);
    const _items = items.map((item) => ({
      _id: new Types.ObjectId(),
      body: item.body,
      status: item.status,
    }));
    await this.BaseModel.updateMany(
      { _id },
      { $push: { items: _items } },
    ).exec();
    return _items.map((it): ITodoItem =>
      ({ ...it, id: it._id.toString() })
    );
  }

  public async updateItemsStatusByIds(
    id: string,
    itemIds: string[],
    status: ITodoItem['status'],
  ): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    const _itemIds = itemIds.map((itemId) => new Types.ObjectId(itemId));
    await this.BaseModel.updateMany(
      {
        _id,
        "items._id": { $in: _itemIds },
      },
      {
        $set: {
          "items.$[elem].status": status,
          "items.$[elem].completedAt": status === 'complete' ? new Date() : null,
        },
      },
      {
        arrayFilters: [
          { "elem._id": { $in: _itemIds } }
        ]
      }
    );
    return true;
  }

  public async deleteItemsByIds(id: string, itemIds: string[]): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    const _itemIds = itemIds.map((itemId) => new Types.ObjectId(itemId));
    await this.BaseModel.updateOne(
      { _id },
      {
        $pull: {
          items: { _id: { $in: _itemIds } }
        }
      },
    ).exec();
    return true;
  }

  public async countItemsStatus(id: string): Promise<StatusCount> {
    const _id = new Types.ObjectId(id);
    const [result] = await this.BaseModel.aggregate([
      { $match: { _id } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.status",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          counts: { $push: { k: "$_id", v: "$count" } }
        }
      },
      { $replaceRoot: { newRoot: { $arrayToObject: "$counts" } } }
    ]);
    return result;
  }

  public watchChangesByIds(ids: string[]) {
    const _ids = ids.map((id) => new Types.ObjectId(id));
    return this.BaseModel.watch(
      [{ $match: { 'documentKey._id': { $in: _ids } } }],
      // [{ $match: { 'documentKey._id': new Types.ObjectId(id) } }],
      { fullDocument: 'updateLookup' }
    );
  }
}

export default new TodoListRepository();

interface StatusCount {
  pending: number;
  complete: number;
}

interface Ns {
  /** Database */
  db: string;
  /** Document ref name */
  coll: string;
}

export type IWatchChangeResponse<T> =
  | IWatchUpdateChange<T>
  | IWatchDeleteChange;

interface IWatchDeleteChange {
  operationType: "delete",
  _id: { _data: string };
  documentKey: { _id: string };
  clusterTime: { $timestamp: string };
  wallTime: string;
  ns: Ns;
}

interface IWatchUpdateChange<T> {
  operationType: 'update';
  _id: { _data: string };
  clusterTime: { $timestamp: string };
  wallTime: string;
  ns: Ns;
  documentKey: { _id: string };
  /** { fullDocument: 'updateLookup' } */
  fullDocument?: T;
  updateDescription: {
    updatedFields: Partial<T> | Partial<T>[];
    removedFields: Partial<T> | Partial<T>[];
    truncatedArrays: Partial<T> | Partial<T>[];
  }
}
