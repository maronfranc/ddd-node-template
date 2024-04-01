import { TODO_ITEM_STATUS } from "../../../infrastructure/mongo/todo-list/todo-list.schema"

export const todoItemJsonSchema = {
  id: {
    name: 'id',
    type: 'string',
  },
  body: {
    name: 'body',
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
