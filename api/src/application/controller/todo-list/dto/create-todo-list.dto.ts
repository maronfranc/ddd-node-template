import { DomainException, HasError } from "../../../../domain/library/exceptions/domain.exception";
import { todoListException } from "../../../../domain/todo-list/todo-list.exception";
import { ITodoList } from "../../../../infrastructure/entity-interfaces/todo-list.interface";

class CreateTodoListDto {
  title: ITodoList['title'];
  description?: ITodoList['description'];

  public constructor(unknownDto: any) {
    if (typeof unknownDto.title !== 'string') {
      throw new DomainException(todoListException['invalid-title']);
    }
    if (unknownDto.description && typeof unknownDto.description !== 'string') {
      throw new DomainException(todoListException['invalid-status']);
    }

    this.title = unknownDto.title
    this.description = unknownDto.description
  }
}

export function validateCreateTodoListDto(unknownDto: any): HasError<CreateTodoListDto> {
  try {
    return { result: new CreateTodoListDto(unknownDto) };
  } catch (error: any) {
    return { error };
  }
}
