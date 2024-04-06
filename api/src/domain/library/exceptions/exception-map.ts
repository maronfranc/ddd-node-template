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
  'unprocessable-entity': <IDomainException>{
    detail: 'Unprocessable entity',
    code: `http-${HttpStatus.UNPROCESSABLE_ENTITY}`,
    statusName: 'UNPROCESSABLE_ENTITY',
  },
  'internal-server-error': <IDomainException>{
    detail: 'Internal server error',
    code: 'http-500',
    statusName: 'INTERNAL_SERVER_ERROR',
  },
  'not-implemented': <IDomainException>{
    detail: 'Not implemented',
    code: `http-${HttpStatus.NOT_IMPLEMENTED}`,
    statusName: 'NOT_IMPLEMENTED',
  },
} as const;
