import { HasError } from "../../domain/library/exceptions/domain.exception";
import { domainException } from "../../domain/library/exceptions/exception-map";
import { ParamTag } from "../library/decorators/route-params";
import { Req } from "./fastify.interface";

export function mapTagToReqParam(paramTag: ParamTag): HasError<keyof Req> {
  if (paramTag === ParamTag.PARAM) return { result: 'params' };
  if (paramTag === ParamTag.BODY) return { result: 'body' };
  if (paramTag === ParamTag.QUERY) return { result: 'query' };

  return { error: domainException['internal-server-error'] };
}
