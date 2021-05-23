import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from "express";

export type Req = ExpressRequest;
export type Res = ExpressResponse;
export type Next = ExpressNextFunction;
export type Middleware = (req: Req, res: Res, next: Next) => void;
