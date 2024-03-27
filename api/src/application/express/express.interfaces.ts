import {
    NextFunction as ExpressNextFunction,
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { IUserWithOmittedData } from "../../infrastructure/interfaces/user.interface";
import { HttpVerb } from "../library/interfaces/request-method";

export type Req<Params = any, Body = any, Query = any> = ExpressRequest<Params, Body, Query>;
export type Res<ResBody = any, Locals = Record<string, any>> = ExpressResponse;
export type Next = ExpressNextFunction;
export type ExpressRouteFunction = (req: any, res: any, next: Next) => void;
export type Middleware = ExpressRouteFunction;
export type ReqAuthorized<Params = any, Body = any, Query = any> =
    Req<Params, Body, Query> & { user: IUserWithOmittedData };

export type ExpressHttpVerb = HttpVerb | 'use';
