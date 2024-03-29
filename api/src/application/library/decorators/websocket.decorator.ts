import { PATH_METADATA } from "./decorator.constants";

export function WebSocketGateway(
  path?: string | string[],
): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  };
}
