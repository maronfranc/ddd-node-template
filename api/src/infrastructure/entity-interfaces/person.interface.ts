import { IBaseInterface } from "./base.interface";

export interface IPerson extends Partial<IBaseInterface> {
  firstName: string;
  lastName: string;
  birthDate: Date;
  cpf?: string;
}
