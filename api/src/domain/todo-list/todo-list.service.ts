import { ITodoList } from "../../infrastructure/entity-interfaces/todo-list.interface";
import { IWatchChangeResponse } from "../../infrastructure/mongo/todo-list/todo-list.repository";

class TodoListService {
  public handleChange(change: IWatchChangeResponse<ITodoList>) {
    if (change.operationType === 'update') {
      return change.fullDocument;
    } else if (change.operationType === 'delete') {
      return { id: change.documentKey._id };
    }
  }
}

export default new TodoListService();
