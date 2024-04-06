import { DomainException, HasError } from "../../../../domain/library/exceptions/domain.exception";
import { todoListException } from "../../../../domain/todo-list/todo-list.exception";
import { ITodoList } from "../../../../infrastructure/entity-interfaces/todo-list.interface";

class UpdateTodoListDto {
  title?: ITodoList['title'];
  description?: ITodoList['description'];

  public constructor(unknownDto: any) {
    if (unknownDto.title && typeof unknownDto.title !== 'string') {
      throw new DomainException(todoListException['invalid-title']);
    }
    if (unknownDto.description && typeof unknownDto.description !== 'string') {
      throw new DomainException(todoListException['invalid-status']);
    }

    this.title = unknownDto.title
    this.description = unknownDto.description
  }
}

export function validateUpdateTodoListDto(unknownDto: any): HasError<UpdateTodoListDto> {
  try {
    return { result: new UpdateTodoListDto(unknownDto) };
  } catch (error: any) {
    return { error };
  }
}
