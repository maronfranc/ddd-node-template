import {
  FastifyRequest,
  FastifyReply,
  FastifyBaseLogger,
  FastifyTypeProvider,
  RawServerDefault,
  FastifyInstance,
} from 'fastify'
import { IncomingMessage, ServerResponse } from "http";
import { IUserWithOmittedData } from "../../infrastructure/interfaces/user.interface";
import { HttpVerb } from "../library/interfaces/request-method";
import { WebSocket } from '@fastify/websocket'

export type Req = FastifyRequest; export type Res = FastifyReply;
export type Next = any;
export type FastifyRouteFunction = (req: any, res: any, next: Next) => void;
export type Middleware = FastifyRouteFunction;
export type FastifyWebsocketFunction =
  (connection: WebSocket, req: Req) => void;
export type ReqAuthorized = Req & { user: IUserWithOmittedData };
export type FastifyHttpVerb = HttpVerb;

export type FastifyApp = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProvider>
