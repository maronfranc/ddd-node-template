import { Document } from 'mongoose';
import { IUser } from '../../../entity-interfaces/user.interface';
import { SchemaDefinitionValues } from '../../base.interface';
import { IPersonSchema } from './person.interface';

export type IUserSensitiveData = Pick<IUser, "password" | "salt">;
export type IUserWithOmittedData = Omit<IUser, keyof IUserSensitiveData>;
export interface IUserDocument extends IUser, Document {
  id: string;
}
export type IUserSchema = Record<keyof Omit<IUser, 'id'>, SchemaDefinitionValues | IPersonSchema>;
