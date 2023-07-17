import { Middleware } from "../../express/Express.interfaces";
import { RequestMethod } from "./request-method";

export interface IEndpoint {
  path: string;
  method: RequestMethod;
  middlewares?: Middleware[];
}