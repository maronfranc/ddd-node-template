import { Document } from 'mongoose';
import { IBaseModel } from '../base.interface';
import { IExampleSubRefDocument } from '../example-sub-ref';

export interface IExample extends Partial<IBaseModel> {
  title: string;
  subDocument?: IExampleSubRefDocument['_id'];
}
export interface IExampleDocument extends IExample, Document { }