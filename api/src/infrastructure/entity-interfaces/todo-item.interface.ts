import { TODO_ITEM_STATUS } from "../mongo/todo-list/todo-item/todo-item.schema";
import { IBaseInterface } from "./base.interface";

type TodoItemStatus = typeof TODO_ITEM_STATUS[number];

export interface ITodoItem extends Partial<IBaseInterface> {
  description?: string;
  status: TodoItemStatus;
}
