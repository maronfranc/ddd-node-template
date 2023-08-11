import { Document } from 'mongoose';
import { IExample } from '../../entity-interfaces/example.interface';
import { SchemaDefinitionValues } from '../../interfaces/base.interface';

export interface IExampleDocument extends IExample, Document {
  id: string;
}
export type IExampleSchema = Record<keyof Omit<IExample, 'id'>, SchemaDefinitionValues>;
