export type IObjectBoolean<T> = {
    [P in keyof T]?: boolean;
};