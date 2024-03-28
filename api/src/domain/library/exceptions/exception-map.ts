import { HttpStatus } from "../../../application/library/http/http-status.enum";
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
  'not-implemented': {
    detail: 'Not implmeneted',
    code: 'http-' + HttpStatus.NOT_IMPLEMENTED,
    statusName: 'NOT_IMPLEMENTED',
  },
} as const;
