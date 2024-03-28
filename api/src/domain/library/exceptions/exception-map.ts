import { authException } from "../../auth/auth.exception";
import { IDomainException } from "./domain.exception";

export const domainException = {
  auth: authException,
  'not-found': <IDomainException>{
    detail: 'Not found error',
    code: 'http-404',
    statusName: 'NOT_FOUND',
  },
  'internal-server-error': <IDomainException>{
    detail: 'Internal server error',
    code: 'http-500',
    statusName: 'INTERNAL_SERVER_ERROR',
  },
} as const;
