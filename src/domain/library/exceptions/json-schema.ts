import { authJsonSchema } from "../../auth/auth-json-schema";

export const jsonSchema = {
  auth: authJsonSchema,
  // Header
  authorization: {
    name: 'authorization',
    type: 'string',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFmMjUzZTU5OTE4NDY1YThiYWJjZjciLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwicGVyc29uIjp7ImZpcnN0TmFtZSI6IkZpcnN0IiwibGFzdE5hbWUiOiJMYXN0In0sIl9fdiI6MCwiaWF0IjoxNjIyMDkxMjY3LCJleHAiOjE2MjIxNzc2Njd9.dYQLxCC4_Xj5IOWLvPmKFZfsvCC1zKTUgdOx0BHsb2M'
  }
};