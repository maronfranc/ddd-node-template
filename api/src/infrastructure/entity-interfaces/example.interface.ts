import { IBaseInterface } from "./base.interface";
import { IExampleSubRef } from "./example-sub-ref.interface";

export interface IExample extends Partial<IBaseInterface> {
  title: string;
  subDocument?: IExampleSubRef['id'];
}
