import { Model, model, Schema } from 'mongoose';
import { EXAMPLE_SUB_REF_REF_NAME } from '../example-sub-ref';
import { IExampleDocument, IExampleSchema } from './example.interface';

export const EXAMPLE_REF_NAME = 'Example';
const schemaDefinition: IExampleSchema = {
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
  // Refs
  subDocument: { type: Schema.Types.ObjectId, ref: EXAMPLE_SUB_REF_REF_NAME },
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
