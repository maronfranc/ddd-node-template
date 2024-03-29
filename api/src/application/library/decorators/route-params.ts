import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { domainException } from "../../../domain/library/exceptions/exception-map";

export const REQ_PARAM_KEY = Symbol('__req__param__');

export enum ParamTag {
  PARAM = 0,
  QUERY,
  BODY,
  REQ,
  RES,
  NEXT,
  WS_CONNECTION,
}
type ParamName = string | undefined;
type ParamMetadata = [ParamTag, ParamName];
export type MethodMetadata = ParamMetadata[];

export function Param(placeholderParam: string): ParameterDecorator {
  return assignMetadata(ParamTag.PARAM, placeholderParam);
}
export function Query(placeholderParam: string): ParameterDecorator {
  return assignMetadata(ParamTag.QUERY, placeholderParam);
}
export function Body(): ParameterDecorator {
  return assignMetadata(ParamTag.BODY);
}
export function HttpReq(): ParameterDecorator {
  return assignMetadata(ParamTag.REQ);
}
export function HttpRes(): ParameterDecorator {
  return assignMetadata(ParamTag.RES);
}
export function HttpNext(): ParameterDecorator {
  return assignMetadata(ParamTag.NEXT);
}
export function WsConnection(): ParameterDecorator {
  return assignMetadata(ParamTag.WS_CONNECTION);
}

function assignMetadata(paramTag: ParamTag, placeholderParam?: string): ParameterDecorator {
  return (target, key, _index) => {
    if (!key) {
      throw new DomainException(domainException['internal-server-error']);
    }
    /** Decorators are inserted in `desc` order here */
    const metadata: ParamMetadata = [paramTag, placeholderParam];
    const metadatas: MethodMetadata = Reflect.getMetadata(
      REQ_PARAM_KEY,
      target,
      key) || [];
    metadatas.push(metadata);
    Reflect.defineMetadata(
      REQ_PARAM_KEY,
      metadatas,
      target,
      key);
  }
}
