import { IBaseInterface } from "./base.interface";
import { IPerson } from "./person.interface";

export interface IUser extends Partial<IBaseInterface> {
  email: string;
  password: string;
  salt: string;
  person: IPerson;
}
