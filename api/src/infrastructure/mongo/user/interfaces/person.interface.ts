import { Document } from 'mongoose';
import { IPerson } from '../../../entity-interfaces/person.interface';
import { SchemaDefinitionValues } from '../../base.interface';

export interface IPersonDocument extends IPerson, Document {
  id: string;
}
export type IPersonSchema = Record<keyof Omit<IPerson, 'id'>, SchemaDefinitionValues>;
