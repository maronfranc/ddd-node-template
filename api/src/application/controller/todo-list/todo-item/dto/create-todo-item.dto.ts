import { DomainException } from "../../../../../domain/library/exceptions/domain.exception";
import { todoListException } from "../../../../../domain/todo-list/todo-list.exception";
import { ITodoItem } from "../../../../../infrastructure/entity-interfaces/todo-item.interface";
import { TODO_ITEM_STATUS } from "../../../../../infrastructure/mongo/todo-list/todo-item/todo-item.schema";

export class CreateTodoItemDto {
  description: ITodoItem['description'];
  status: ITodoItem['status'];

  public constructor(unknownDto: any) {
    if (unknownDto.status && !TODO_ITEM_STATUS.includes(unknownDto.status)) {
      throw new DomainException(todoListException['invalid-status']);
    }
    if (unknownDto.description && typeof unknownDto.description !== 'string') {
      throw new DomainException(todoListException['invalid-status']);
    }

    this.description = unknownDto.description
    this.status = unknownDto.status
  }
}
