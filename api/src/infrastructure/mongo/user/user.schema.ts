import { Model, model, Schema } from 'mongoose';
import { IUserDocument, IUserSchema } from './interfaces/user.interface';

export const USER_REF_NAME = 'User';
const schemaDefinition: IUserSchema = {
  createdAt: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
    select: false,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: new Date().toISOString(),
    select: false,
  },
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
    select: false
  },
  salt: {
    type: String,
    required: true,
    select: false
  },
  person: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: {
      type: Date,
      required: true,
      select: false,
    },
    cpf: {
      type: String,
      required: false,
      select: false
    },
  }
}
const UserSchema = new Schema<IUserDocument, Model<IUserDocument>>(schemaDefinition);
UserSchema.pre<IUserDocument>('save', async function (this: any) {
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

export default model<IUserDocument, any>(USER_REF_NAME, UserSchema);
