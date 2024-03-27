import { Document, Model, Types } from "mongoose";
import { IBaseInterface } from "../entity-interfaces/base.interface";
import { IObjectBoolean } from "./interfaces/object-boolean.interface";

export abstract class BaseRepository<T extends Partial<IBaseInterface>> {
  constructor(protected readonly BaseModel: Model<Document>) { }
  public async create(item: T): Promise<T> {
    const newDocument = await this.BaseModel.create(item);
    const createdUser = newDocument.toJSON();
    createdUser.id = createdUser._id;
    return createdUser as T;
  }
  public async updateById(id: string, item: Partial<T>): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    try {
      await this.BaseModel.updateOne({ _id }, item).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async deleteById(id: string): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    try {
      await this.BaseModel.deleteOne({ _id }).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async findById(id: string, options?: IOptions<T>): Promise<T | null> {
    try {
      const objectId = new Types.ObjectId(id);
      const query = this.BaseModel.findById(objectId);
      if (options?.select) {
        query.select(options.select as Record<string, boolean>);
      }
      const entity = await query.lean().exec()
      if (!entity) return null;
      entity.id = entity._id;
      return entity as T;
    } catch (err: any) {
      return null;
    }
  }
  public async findOne(filter: Partial<T>, options?: IOptions<T>): Promise<T | null> {
    try {
      const query = this.BaseModel.findOne(filter);
      if (options?.select) {
        query.select(options.select as Record<string, boolean>);
      }
      const entity = await query.lean().exec();
      if (!entity) return null;
      entity.id = entity._id;
      return entity as T;
    } catch (err: any) {
      return null;
    }
  }
  public async find(filter: Partial<T>, options?: IOptions<T>): Promise<T[]> {
    const query = this.BaseModel.find(filter, options);
    const entities = await query.lean().exec();
    return entities.map((entity) => {
      entity.id = entity._id;
      return entity;
    }) as T[];
  }
  public async exists(filter: Partial<T>): Promise<boolean> {
    const exists = await this.BaseModel.exists(filter);
    return !!exists?._id;
  }
}

interface IOptions<T> {
  select: IObjectBoolean<T>;
}
