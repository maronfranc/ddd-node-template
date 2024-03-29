import { Model, Schema } from 'mongoose';
import { ITodoItemDocument, ITodoItemSchema } from './todo-item.interface';

export const TODO_ITEM_STATUS = ['pending', 'complete'] as const;
const schemaDefinition: ITodoItemSchema = {
  createdAt: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
  },
  updatedAt: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
  },
  description: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: [...TODO_ITEM_STATUS],
  },
}

const TodoItemSchema = new Schema<ITodoItemDocument, Model<ITodoItemDocument>>(schemaDefinition);
TodoItemSchema.pre<ITodoItemDocument>('save', async function(this: any) {
  if (this._doc) {
    const doc = this._doc;
    const now = new Date().toISOString();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
    doc.updatedAt = now;
  }
  return this;
});
