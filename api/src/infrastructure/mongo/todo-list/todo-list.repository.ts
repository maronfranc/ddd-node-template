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
      description: item.description,
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
    // TODO: return modifiedCount
    await this.BaseModel.updateMany(
      {
        _id,
        "items._id": { $in: _itemIds },
      },
      { $set: { "items.$[elem].status": status } },
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
}

export default new TodoListRepository();

interface StatusCount {
  pending: number;
  complete: any;
}
