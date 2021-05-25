import { Model, model, Schema } from 'mongoose'
import { IExample, IExampleDocument } from './example.interface';

export const EXAMPLE_REF_NAME = 'Example';
const schemaDefinition: Record<keyof IExample, any> = {
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
  title: {
    type: String,
    required: true,
  },
}
const ExampleSchema = new Schema<IExampleDocument, Model<IExampleDocument>>(schemaDefinition);
ExampleSchema.pre<IExampleDocument>('save', async function (this: any) {
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

export default model<IExampleDocument, any>(EXAMPLE_REF_NAME, ExampleSchema);