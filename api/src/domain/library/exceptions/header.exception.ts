import { IDomainException } from './domain.exception';
import { jsonSchema } from './json-schema';

export const headerException = {
  'bearer-token-not-provided': <IDomainException>{
    detail: 'Route is protected, please provide an authorization token',
    code: 'header-0001',
    errors: [jsonSchema.authorization],
    statusName: 'UNAUTHORIZED',
  },
  'bearer-token-invalid-credentials': <IDomainException>{
    detail: 'Invalid credentials',
    code: 'header-0002',
    errors: [jsonSchema.authorization],
    statusName: 'BAD_REQUEST',
  }
} as const;
