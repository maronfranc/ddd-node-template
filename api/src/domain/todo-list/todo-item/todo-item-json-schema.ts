import { TODO_ITEM_STATUS } from "../../../infrastructure/mongo/todo-list/todo-item/todo-item.schema";

export const todoItemJsonSchema = {
  id: {
    name: 'id',
    type: 'string',
  },
  description: {
    name: 'description',
    type: 'string',
  },
  status: {
    name: 'status',
    type: 'string',
    enum: TODO_ITEM_STATUS,
  },
}

export const todoItemsJsonSchema = {
  type: 'array',
  items: {
    name: 'items',
    properties: todoItemJsonSchema,
  },
}
