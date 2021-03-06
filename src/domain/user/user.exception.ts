import { jsonSchema } from "../library/exceptions/json-schema";

export const userException = {
  'user-by-email-not-found': {
    detail: 'User with the expecified email does not exists in the user database',
    code: 'user-0001',
    errors: [jsonSchema.auth.email],
    statusName: 'NOT_FOUND'
  },
} as const;