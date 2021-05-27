import { authException } from "../auth/auth.exception";
import { IDomainException } from "./domain.exception";

export const domainException = {
  auth: authException,
  'internal-server-error': <IDomainException>{
    detail: 'Internal server error',
    code: 'internal-0001',
    statusName: 'INTERNAL_SERVER_ERROR',
  }
} as const;
