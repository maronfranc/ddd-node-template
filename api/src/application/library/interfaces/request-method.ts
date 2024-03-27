export enum RequestMethod {
  GET = 0,
  POST,
  PUT,
  DELETE,
  PATCH,
  ALL,
  OPTIONS,
  HEAD,
}

export type HttpVerb = 'get' |
  'post' |
  'put' |
  'delete' |
  'patch';

export type FastifyHttpVerb = HttpVerb | 'all';
