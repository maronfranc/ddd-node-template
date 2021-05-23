export const isFunction = (param: any): param is CallableFunction => {
    return typeof param === "function";
}