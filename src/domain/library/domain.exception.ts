import { domainException } from "./exception-map";

export interface IDomainException {
  detail: string;
  code?: string;
  errors?: any[];
}

/**
 * Exception to format error to client.
 */
export class DomainException extends Error implements IDomainException {
  public detail: IDomainException['detail'];
  public code: IDomainException['code'];
  public errors: IDomainException['errors'];
  public constructor(
    exception: IDomainException = domainException['internal-server-error']
  ) {
    super(exception.detail);
    this.detail = exception.detail;
    this.code = exception.code;
    if (Array.isArray(exception.errors)) {
      this.errors = exception.errors;
    }
  }
}
