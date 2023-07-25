import { Document } from 'mongoose';
import { IBaseModel } from '../../base.interface';

export interface IPerson extends Partial<IBaseModel> {
  firstName: string;
  lastName: string;
  birthDate: Date;
  cpf?: string;
}
export interface IPersonDocument extends IPerson, Document { }