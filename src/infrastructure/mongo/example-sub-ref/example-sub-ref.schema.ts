import { Model, model, Schema } from 'mongoose'
import { IExampleSubRefBaseDocument, IExampleSubRefDocument } from './example-sub-ref.interface';

export const EXAMPLE_SUB_REF_REF_NAME = 'ExampleSubRef';
const ExampleSubRefSchema = new Schema<IExampleSubRefDocument, Model<IExampleSubRefDocument>>({
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
  name: {
    type: String,
    required: true,
    lowercase: true
  },
});
ExampleSubRefSchema.pre<IExampleSubRefBaseDocument>('save', async function (this: any) {
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

export default model<IExampleSubRefDocument, any>(EXAMPLE_SUB_REF_REF_NAME, ExampleSubRefSchema);