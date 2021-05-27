import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction
} from "express";
import { IUser } from "../infrastructure/mongo/user";

export type Req<Params = any, Body = any, Query = any> = ExpressRequest<Params, Body, Query>;
export type Res<ResBody = any, Locals = Record<string, any>> = ExpressResponse;
export type Next = ExpressNextFunction;
export type Middleware = (req: any, res: any, next: Next) => void;
export type ReqAuthorized<Params = any, Body = any, Query = any> =
    Req<Params, Body, Query> & { user: IUser };
