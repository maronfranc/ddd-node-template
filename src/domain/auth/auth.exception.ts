import { IDomainException } from "../library/exceptions/domain.exception";
import { jsonSchema } from "../library/exceptions/json-schema";

export const authException = {
  /** Invalid email or password */
  'invalid-credentials': <IDomainException>{
    detail: 'Email or password are incorrect',
    code: 'auth-0001',
    errors: [jsonSchema.auth.email, jsonSchema.auth.password],
    statusName: 'BAD_REQUEST',
  },
  'user-email-not-found': <IDomainException>{
    detail: 'Expecified email was not found in user database',
    code: 'auth-0002',
    errors: [jsonSchema.auth.email],
    statusName: 'NOT_FOUND',
  },
  'email-already-exists': <IDomainException>{
    detail: 'Email is already taken',
    code: 'auth-0003',
    errors: [jsonSchema.auth.email],
    statusName: 'CONFLICT',
  },
  'invalid-password': <IDomainException>{
    detail: 'Invalid password, check errors object for more information',
    code: 'auth-0004',
    errors: [jsonSchema.auth.password],
    statusName: 'BAD_REQUEST'
  },
  'invalid-birth-date': <IDomainException>{
    detail: 'Invalid birth date',
    code: 'auth-0005',
    errors: [jsonSchema.auth.brithDate],
    statusName: 'BAD_REQUEST'
  },
  'invalid-first-name': <IDomainException>{
    detail: 'Invalid name',
    code: 'auth-0006',
    errors: [jsonSchema.auth.firstName],
    statusName: 'BAD_REQUEST'
  },
  'invalid-last-name': <IDomainException>{
    detail: 'Invalid name',
    code: 'auth-0007',
    errors: [jsonSchema.auth.lastName],
    statusName: 'BAD_REQUEST'
  },
  'invalid-email': <IDomainException>{
    detail: 'Invalid email',
    code: 'auth-0001',
    errors: [jsonSchema.auth.email],
    statusName: 'BAD_REQUEST',
  },
} as const;
