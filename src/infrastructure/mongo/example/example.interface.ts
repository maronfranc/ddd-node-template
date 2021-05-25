import { Document } from 'mongoose';
import { IBaseModel } from '../Base.interface';

export interface IExample extends Partial<IBaseModel> {
  title: string;
}
export interface IExampleDocument extends IExample, Document { }