import { RequestMethod } from "./request-method";

export interface IEndpoint {
    path: string;
    method: RequestMethod;
}