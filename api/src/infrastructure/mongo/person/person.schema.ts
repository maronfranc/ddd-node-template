// import { Model, model, Schema } from 'mongoose'
// import { USER_REF_NAME } from '../user';
// import { IPerson, IPersonDocument } from './person.interface';

// export const PERSON_REF_NAME = 'Person';
// const personSchemaDefinition: Record<keyof IPerson, any> = {
//   createdAt: { type: Date, required: false, default: new Date().toISOString(), },
//   updatedAt: { type: Date, required: false, default: new Date().toISOString(), },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   cpf: { type: String, required: true },
// }
// const PersonSchema = new Schema<IPersonDocument, Model<IPersonDocument>>(personSchemaDefinition);
// PersonSchema.pre<IPersonDocument>('save', async function (this: any) {
//   if (this._doc) {
//     const doc = this._doc;
//     const now = new Date().toISOString();
//     if (!doc.createdAt) {
//       doc.createdAt = now;
//     }
//     doc.updatedAt = now;
//   }
//   return this;
// });

// export default model<IPersonDocument, any>(PERSON_REF_NAME, PersonSchema);