import { IEndpoint } from "../IEndpoint";
import { RequestMethod } from "../request-method";
import { PATH_METADATA, METHOD_METADATA } from "./decorator.constants";

export interface RequestMappingMetadata {
  path?: string;
  method?: RequestMethod;
}
export const RequestMapping = (
  metadata: RequestMappingMetadata
): MethodDecorator => {
  const path = metadata[PATH_METADATA]!;
  const method = metadata[METHOD_METADATA]!;
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const endpoint: IEndpoint = {
      path,
      method
    };
    Reflect.defineMetadata(key, endpoint, target);
    return descriptor;
  };
};
const createMappingDecorator = (method: IEndpoint['method']) => (
  path: IEndpoint['path'] = "",
): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: method,
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

// /** @see https://stackoverflow.com/questions/42281045/can-typescript-property-decorators-set-metadata-for-the-class */
// export const MyPropertyDecorator = (endpoint: string): MethodDecorator => {
//   return (target, key, aaa) => {
//     console.log(" | ----- ----- | target | ----- ----- | ", typeof target);
//     console.log(target);
//     console.log(" | _____ _____ | target | _____ _____ | ", typeof target);
//     console.log(" | ----- ----- | property | ----- ----- | ", typeof key);
//     console.log(key);
//     console.log(" | _____ _____ | property | _____ _____ | ", typeof key);
//     console.log(" | ----- ----- | aaa | ----- ----- | ", typeof aaa);
//     console.log(aaa);
//     console.log(" | _____ _____ | aaa | _____ _____ | ", typeof aaa);
//     var classConstructor = target.constructor;
//     console.log('property target: ', classConstructor);
//     const metadata = Reflect.getMetadata(key, classConstructor) || {};
//     metadata[key] = endpoint;
//     Reflect.defineMetadata(key, metadata, classConstructor);
//   };
// };