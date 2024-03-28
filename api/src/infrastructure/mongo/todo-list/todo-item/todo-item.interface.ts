import { Document } from 'mongoose';
import { ITodoItem } from '../../../entity-interfaces/todo-item.interface';
import { SchemaDefinitionValues } from '../../../interfaces/base.interface';

export interface ITodoItemDocument extends ITodoItem, Document {
  id: string;
}
export type ITodoItemSchema = Record<keyof Omit<ITodoItem, 'id'>, SchemaDefinitionValues>;
