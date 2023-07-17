import { Document, Model, Types } from "mongoose";
import { IBaseModel } from "./Base.interface";

export abstract class BaseRepository<T extends Partial<IBaseModel>>  {
  constructor(protected readonly BaseModel: Model<Document>) { }
  public async create(item: T): Promise<T> {
    const newDocument = await this.BaseModel.create(item);
    return newDocument.toJSON() as unknown as Promise<T>;
  }
  public async updateOne(id: string, item: Partial<T>): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    try {
      await this.BaseModel.updateOne({ _id }, item).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    const _id = new Types.ObjectId(id);
    try {
      await this.BaseModel.deleteOne({ _id }).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
  public async findById(id: string): Promise<T | null> {
    const _id = new Types.ObjectId(id);
    return this.BaseModel
      .findById(_id)
      .lean()
      .exec() as Promise<T | null>;
  }
  public async findOne(filter: Partial<T>): Promise<T | null> {
    return this.BaseModel
      .findOne(filter)
      .lean()
      .exec() as Promise<T | null>;
  }
  public async find(filter: Partial<T>, options?: Object): Promise<T[]> {
    return this.BaseModel
      .find(filter, options)
      .lean()
      .exec() as Promise<T[]>;
  }
  public async exists(filter: Partial<T>): Promise<boolean> {
    const exists = await this.BaseModel.exists(filter);
    return !!exists?._id;
  }
}
