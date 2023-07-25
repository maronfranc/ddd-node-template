import { Middleware } from "../../express/express.interfaces";
import { RequestMethod } from "./request-method";

export interface IEndpoint {
  path: string;
  method: RequestMethod;
  middlewares?: Middleware[];
}