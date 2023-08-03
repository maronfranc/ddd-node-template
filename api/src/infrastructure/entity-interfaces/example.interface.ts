import { IExampleSubRefDocument } from "../mongo";
import { IBaseInterface } from "./base.interface";

export interface IExample extends Partial<IBaseInterface> {
  title: string;
  subDocument?: IExampleSubRefDocument['id'];
}
