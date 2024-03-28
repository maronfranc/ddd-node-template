import { HttpStatusNames } from "../../../application/library/http/http-status-names";
import { domainException } from "./exception-map";

export interface IDomainException {
  detail: Readonly<string>;
  /** StatusCode that will set the code automatically. */
  statusName: Readonly<HttpStatusNames>;
  code?: Readonly<string>;
  errors?: Readonly<any[]>;
}
/**
 * Exception to format error to client.
 */
export class DomainException extends Error implements IDomainException {
  public detail: IDomainException['detail'];
  public code: IDomainException['code'];
  public errors: IDomainException['errors'];
  public statusName: IDomainException['statusName'];
  public constructor(
    exception: IDomainException = domainException['internal-server-error']
  ) {
    super(exception.detail);
    this.detail = exception.detail;
    this.code = exception.code;
    this.statusName = exception.statusName;
    if (Array.isArray(exception.errors)) {
      this.errors = exception.errors;
    }
  }
}
