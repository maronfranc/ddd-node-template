import { Document } from 'mongoose';
import { IBaseModel } from '../base.interface';
import { IExampleDocument } from '../example';

export interface IExampleSubRef extends IBaseModel {
  name: string;
}
export interface IExampleSubRefBaseDocument extends IExampleSubRef, Document { }
export interface IExampleSubRefDocument extends IExampleSubRefBaseDocument {
  example: IExampleDocument['_id'];
}