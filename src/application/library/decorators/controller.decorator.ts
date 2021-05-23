import { PATH_METADATA } from './decorator.constants';

export function Controller(
    path?: string | string[],
): ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(PATH_METADATA, path, target);
    };
}
