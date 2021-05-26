import { Document } from 'mongoose';
import { IBaseModel } from '../../Base.interface';
import { IPerson } from './person.interface';

export interface IUser extends Partial<IBaseModel> {
  email: string;
  password?: string;
  salt?: string;
  person: IPerson;
}
export interface IUserDocument extends IUser, Document { }