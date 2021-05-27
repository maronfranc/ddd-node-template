import { jsonSchema } from "../library/json-schema";

export const authException = {
  /** Invalid email or password */
  'invalid-credentials': {
    detail: 'Email or password are incorrect',
    code: 'auth-0001',
    errors: [jsonSchema.email, jsonSchema.password]
  },
  'user-email-not-found': {
    detail: 'Expecified email was not found in user database',
    code: 'auth-0002',
    errors: [jsonSchema.email]
  },
  'email-already-exists': {
    detail: 'Email is already taken',
    code: 'auth-0003',
    errors: [jsonSchema.email]
  },
  'invalid-password': {
    detail: 'Invalid password',
    code: 'auth-0004',
    errors: [jsonSchema.password]
  },
};
