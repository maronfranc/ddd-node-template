import { Model, model, Schema } from 'mongoose';
import { ITodoListDocument, ITodoListSchema } from './todo-list.interface';
import { TODO_ITEM_STATUS } from './todo-item/todo-item.schema';

export const TODO_LIST_REF_NAME = 'TodoList';
const schemaDefinition: ITodoListSchema = {
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
  title: { type: String, required: true },
  description: { type: String, required: false },
  items: [{
    createdAt: {
      type: Date,
      required: false,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      required: false,
      default: new Date(),
    },
    description: { type: String, required: false },
    status: {
      type: String,
      required: true,
      enum: [...TODO_ITEM_STATUS],
    },
  }],
}

const TodoListSchema = new Schema<ITodoListDocument, Model<ITodoListDocument>>(schemaDefinition);
TodoListSchema.pre<ITodoListDocument>('save', async function(this: any) {
  if (this._doc) {
    const doc = this._doc;
    const now = new Date();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
    doc.updatedAt = now;
  }
  return this;
});

export default model<ITodoListDocument, any>(TODO_LIST_REF_NAME, TodoListSchema);
