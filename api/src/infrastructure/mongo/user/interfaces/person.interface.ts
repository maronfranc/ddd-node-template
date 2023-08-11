import { Document } from 'mongoose';
import { IPerson } from '../../../entity-interfaces/person.interface';
import { SchemaDefinitionValues } from '../../../interfaces/base.interface';

export interface IPersonDocument extends IPerson, Document {
  id: string;
}
type IPersonOmittedKeys = Omit<IPerson, 'id'>;
export type IPersonSchema = Record<keyof IPersonOmittedKeys, SchemaDefinitionValues>;
