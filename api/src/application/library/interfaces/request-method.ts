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

export type RequestMethodName =
  'get' |
  'post' |
  'put' |
  'delete' |
  'patch' |
  'use';
