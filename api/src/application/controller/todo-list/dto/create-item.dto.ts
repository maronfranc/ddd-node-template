import { DomainException, HasError } from "../../../../domain/library/exceptions/domain.exception";
import { todoListException } from "../../../../domain/todo-list/todo-list.exception";
import { ITodoItem } from "../../../../infrastructure/entity-interfaces/todo-item.interface";
import { TODO_ITEM_STATUS } from "../../../../infrastructure/mongo/todo-list/todo-list.schema";

class CreateTodoItemDto {
  body: ITodoItem['body'];
  status: ITodoItem['status'];

  public constructor(unknownDto: any) {
    if (unknownDto.status && !TODO_ITEM_STATUS.includes(unknownDto.status)) {
      throw new DomainException(todoListException['invalid-status']);
    }
    if (unknownDto.body && typeof unknownDto.body !== 'string') {
      throw new DomainException(todoListException['invalid-status']);
    }

    this.body = unknownDto.body;
    this.status = unknownDto.status ?? 'pending';
  }
}

export function validateCreateTodoItemDto(unknownDto: any): HasError<CreateTodoItemDto> {
  try {
    return { result: new CreateTodoItemDto(unknownDto) };
  } catch (error: any) {
    return { error };
  }
}
