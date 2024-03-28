import { IDomainException } from "../../library/exceptions/domain.exception";
import { todoItemJsonSchema, todoItemsJsonSchema } from "./todo-item-json-schema";

export const todoItemException = {
  'invalid-item-description': <IDomainException>{
    detail: 'Invalid todoList.item.descrition',
    code: 'todo-item-0001',
    errors: [todoItemJsonSchema.description],
    statusName: 'BAD_REQUEST',
  },
  'invalid-item-status': <IDomainException>{
    detail: 'Invalid todoList.item.status',
    code: 'todo-list-0002',
    errors: [todoItemJsonSchema.status],
    statusName: 'BAD_REQUEST',
  },
  'invalid-array-of-items': {
    detail: 'Invalid todoList.items',
    code: 'todo-item-0003',
    errors: [todoItemsJsonSchema],
    statusName: 'BAD_REQUEST',
  },
  'invalid-array-of-items-id': {
    detail: 'Invalid todoList.items.$.id',
    code: 'todo-item-0004',
    errors: [
      {
        type: 'array',
        id: todoItemJsonSchema.id,
      }
    ],
    statusName: 'BAD_REQUEST',
  },
} as const;
