import { Middleware } from '../../express/Express.interfaces';
import { IEndpoint } from '../interfaces/IEndpoint';
import { RequestMethod } from '../interfaces/request-method';
import { METHOD_METADATA, MIDDLEWARE_METADATA, PATH_METADATA } from './decorator.constants';

export interface RequestMappingMetadata {
  path?: string;
  method?: RequestMethod;
  middlewares?: Middleware[];
}
interface IRequestMappingOptions {
  path?: string;
  middlewares?: Middleware[];
}
export const RequestMapping = (
  metadata: RequestMappingMetadata
): MethodDecorator => {
  const path = metadata[PATH_METADATA]!;
  const method = metadata[METHOD_METADATA]!;
  const middlewares = metadata[MIDDLEWARE_METADATA]!;
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const endpoint: IEndpoint = {
      path,
      method,
      middlewares
    };
    Reflect.defineMetadata(key, endpoint, target);
    return descriptor;
  };
};
const createMappingDecorator = (method: IEndpoint['method']) => (
  options: IEndpoint['path'] | IRequestMappingOptions = '',
): MethodDecorator => {
  if (typeof options === 'string') {
    return RequestMapping({
      [PATH_METADATA]: options,
      [METHOD_METADATA]: method,
      [MIDDLEWARE_METADATA]: [],
    });
  }
  return RequestMapping({
    [PATH_METADATA]: options.path ?? '',
    [METHOD_METADATA]: method,
    [MIDDLEWARE_METADATA]: options.middlewares ?? [],
  });
};
export const Post = createMappingDecorator(RequestMethod.POST);
export const Get = createMappingDecorator(RequestMethod.GET);
export const Delete = createMappingDecorator(RequestMethod.DELETE);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Options = createMappingDecorator(RequestMethod.OPTIONS);
export const Head = createMappingDecorator(RequestMethod.HEAD);
export const All = createMappingDecorator(RequestMethod.ALL);
