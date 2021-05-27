import { jsonSchema } from './json-schema';

export const headerException = {
  'bearer-token-not-provided': {
    detail: 'Route is protected, please provide an authorization token',
    code: 'header-0001',
    errors: [jsonSchema.authorization],
    statusName: 'BAD_REQUEST',
  }
}
