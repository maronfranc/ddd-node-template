import { IDomainException } from "../library/domain.exception";
import { jsonSchema } from "../library/json-schema";

export const authException = {
  /** Invalid email or password */
  'invalid-credentials': <IDomainException>{
    detail: 'Email or password are incorrect',
    code: 'auth-0001',
    errors: [jsonSchema.email, jsonSchema.password],
    statusName: 'BAD_REQUEST',
  },
  'user-email-not-found': <IDomainException>{
    detail: 'Expecified email was not found in user database',
    code: 'auth-0002',
    errors: [jsonSchema.email],
    statusName: 'NOT_FOUND',
  },
  'email-already-exists': <IDomainException>{
    detail: 'Email is already taken',
    code: 'auth-0003',
    errors: [jsonSchema.email],
    statusName: 'CONFLICT',
  },
  'invalid-password': <IDomainException>{
    detail: 'Invalid password, check errors object for more information',
    code: 'auth-0004',
    errors: [jsonSchema.password],
    statusName: 'BAD_REQUEST'
  },
} as const;
