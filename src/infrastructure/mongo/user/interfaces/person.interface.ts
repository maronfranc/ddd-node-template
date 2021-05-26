import { Document } from 'mongoose';
import { IBaseModel } from '../../Base.interface';

export interface IPerson extends Partial<IBaseModel> {
  firstName: string;
  lastName: string;
  cpf?: string;
}
export interface IPersonDocument extends IPerson, Document { }