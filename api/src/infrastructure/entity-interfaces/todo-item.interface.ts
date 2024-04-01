import { TODO_ITEM_STATUS } from "../mongo/todo-list/todo-list.schema";
import { IBaseInterface } from "./base.interface";

type TodoItemStatus = typeof TODO_ITEM_STATUS[number];

export interface ITodoItem extends Partial<IBaseInterface> {
  // TODO:
  body?: string;
  status: TodoItemStatus;
}
