import { Middleware } from "../../fastify/fastify.interface";
import { RequestMethod } from "./request-method";

export interface IEndpoint {
  path: string;
  method: RequestMethod;
  middlewares?: Middleware[];
}
