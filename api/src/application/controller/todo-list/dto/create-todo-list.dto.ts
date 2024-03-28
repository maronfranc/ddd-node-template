import { DomainException } from "../../../../domain/library/exceptions/domain.exception";
import { todoListException } from "../../../../domain/todo-list/todo-list.exception";
import { ITodoList } from "../../../../infrastructure/entity-interfaces/todo-list.interface";

export class CreateTodoListDto {
  title: ITodoList['title'];
  // status: ITodoList['status'];
  description?: ITodoList['description'];

  public constructor(unknownDto: any) {
    if (typeof unknownDto.title !== 'string') {
      throw new DomainException(todoListException['invalid-title']);
    }
    // if (unknownDto.status && !TODO_LIST_STATUS.includes(unknownDto.status)) {
    //   throw new DomainException(todoListException['invalid-status']);
    // }
    if (unknownDto.description && typeof unknownDto.description !== 'string') {
      throw new DomainException(todoListException['invalid-status']);
    }

    this.title = unknownDto.title
    // this.status = unknownDto.status
    this.description = unknownDto.description
  }
}
