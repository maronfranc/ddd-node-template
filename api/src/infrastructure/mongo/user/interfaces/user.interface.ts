import { Document } from 'mongoose';
import { IBaseModel } from '../../base.interface';
import { IPerson } from './person.interface';

export interface IUserModel extends Partial<IBaseModel> {
  email: string;
  password: string;
  salt: string;
  person: IPerson;
}
export type IUserSensitiveData = Pick<IUserModel, "password" | "salt">;
export type IUserWithOmittedData = Omit<IUserModel, keyof IUserSensitiveData>;
export interface IUserDocument extends IUserModel, Document { }
