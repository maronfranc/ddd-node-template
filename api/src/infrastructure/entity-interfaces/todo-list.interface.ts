import { IBaseInterface } from "./base.interface";
import { ITodoItem } from "./todo-item.interface";

export interface ITodoList extends Partial<IBaseInterface> {
  title: string;
  description?: string;
  items?: ITodoItem[];
}
