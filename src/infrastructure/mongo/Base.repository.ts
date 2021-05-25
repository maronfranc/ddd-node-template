import { Types, Model, Document } from "mongoose";
import { IBaseModel } from "./Base.interface";

export abstract class BaseRepository<T extends Partial<IBaseModel>>  {
  constructor(protected readonly BaseModel: Model<Document>) { }
  public async create(item: T): Promise<T> {
    return this.BaseModel.create(item) as unknown as Promise<T>;
  }
  public async updateOne(id: string, item: Partial<T>): Promise<boolean> {
    const _id = Types.ObjectId(id);
    try {
      await this.BaseModel.updateOne({ _id }, item).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    const _id = Types.ObjectId(id);
    try {
      await this.BaseModel.remove({ _id }).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async findById(id: string): Promise<T | null> {
    const _id = Types.ObjectId(id);
    return this.BaseModel
      .findById(_id)
      .lean()
      .exec() as Promise<T | null>;
  }
  public async findOne(cond: Partial<T>): Promise<T | null> {
    return this.BaseModel
      .findOne(cond)
      .lean()
      .exec() as Promise<T | null>;
  }
  public async find(condition: Partial<T>, options?: Object): Promise<T[]> {
    return this.BaseModel
      .find(condition, options)
      .lean()
      .exec() as Promise<T[]>;
  }
  public async exists(cond: Partial<T>): Promise<boolean> {
    return this.BaseModel.exists(cond);
  }
}
