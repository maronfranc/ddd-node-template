import { Document } from 'mongoose';
import { SchemaDefinitionValues } from '../../interfaces/base.interface';
import { ITodoList } from '../../entity-interfaces/todo-list.interface';
import todoItemSchema from './todo-item/todo-item.schema';

export interface ITodoListDocument extends ITodoList, Document {
  id: string;
}
export type ITodoListSchema =
  Record<keyof Omit<ITodoList, 'id' | 'items'>, SchemaDefinitionValues> &
  { items: any[] };
