import { Document } from 'mongoose';
import { IUser } from '../../../entity-interfaces/user.interface';
import { SchemaDefinitionValues } from '../../../interfaces/base.interface';
import { IPersonSchema } from './person.interface';

export interface IUserDocument extends IUser, Document {
  id: string;
}
export type IUserSchema = Record<keyof Omit<IUser, 'id'>, SchemaDefinitionValues | IPersonSchema>;
