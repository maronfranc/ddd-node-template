import { IDomainException } from "../library/exceptions/domain.exception";
import { todoListJsonSchema } from "./todo-list-json-schema";

export const todoListException = {
  'invalid-title': <IDomainException>{
    detail: 'Invalid todoList.title',
    code: 'todo-list-0001',
    errors: [todoListJsonSchema.title],
    statusName: 'BAD_REQUEST',
  },
  'invalid-status': <IDomainException>{
    detail: 'Invalid todoList.status',
    code: 'todo-list-0002',
    errors: [todoListJsonSchema.status],
    statusName: 'BAD_REQUEST',
  },
  'invalid-description': <IDomainException>{
    detail: 'Invalid todoList.description',
    code: 'todo-list-0003',
    errors: [todoListJsonSchema.description],
    statusName: 'BAD_REQUEST',
  },
} as const;
