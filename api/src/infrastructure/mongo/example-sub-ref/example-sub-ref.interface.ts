import { Document } from 'mongoose';
import { IExampleSubRef } from '../../entity-interfaces/example-sub-ref.interface';
import { SchemaDefinitionValues } from '../base.interface';
import { IExampleDocument } from '../example';

export interface IExampleSubRefBaseDocument extends IExampleSubRef, Document {
  id: string;
}
export interface IExampleSubRefDocument extends IExampleSubRefBaseDocument {
  example: IExampleDocument['id'];
}
export type IExampleSubRefSchema = Record<keyof Omit<IExampleSubRef, 'id'>, SchemaDefinitionValues>;
