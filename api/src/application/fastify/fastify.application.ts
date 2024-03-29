import { IController, IInitOption } from "../application.interfaces";
import Fastify from 'fastify'
import websocket, { WebSocket } from '@fastify/websocket'
import { HttpStatus } from "../library/http/http-status.enum";
import { Next, Req, Res } from "./fastify.interface";
import { DomainException } from "../../domain/library/exceptions/domain.exception";
import { MethodMetadata, ParamTag, REQ_PARAM_KEY } from "../library/decorators/route-params";
import { domainException } from "../../domain/library/exceptions/exception-map";
import websocketLoader from "./websocket-loader";
import controllerLoader from "./controller-loader";

export class FastifyApplication {
  public app = Fastify({ logger: true });

  public init(opt?: IInitOption) {
    this.app.register(websocket)
    this.app.register(
      async (app) => controllerLoader.init(opt).load(app)
    )
    this.app.register(
      async (app) => websocketLoader.init(opt).load(app)
    )
    this.app.all('*', this.routeNotFound);
    this.app.setErrorHandler(this.errorMiddleware);
  }

  public listen(port: number, callback: (err: Error | null) => void) {
    this.app.ready().then(() =>
      this.app.listen({ port, host: '0.0.0.0' }, callback)
    );
  }

  private routeNotFound(_: Req, res: Res) {
    const message = { detail: "Route not found" };
    return res.status(HttpStatus.NOT_FOUND).send(message);
  }

  private errorMiddleware(error: DomainException | any, _req: Req, res: Res) {
    const errorCode = HttpStatus[error?.statusName]
      ?? HttpStatus.INTERNAL_SERVER_ERROR;
    if (!(error instanceof Error)) {
      return res.status(Number(errorCode)).send(error);
    }
    const { name, message, stack, cause } = error;
    return res.status(Number(errorCode))
      .send({ name, message, stack, cause });
  }
}

export function mapTagToReqParam(paramTag: ParamTag): keyof Req {
  if (paramTag === ParamTag.PARAM) return 'params';
  if (paramTag === ParamTag.BODY) return 'body';
  if (paramTag === ParamTag.QUERY) return 'query';
  throw new DomainException(domainException['internal-server-error']);
}

interface IServerObject {
  controller: IController;
  methodName: string;
  req: Req;
  res?: Res;
  next?: Next;
  conn?: WebSocket;
}
export function getDecoratedParams({
  controller,
  methodName,
  req,
  res,
  next,
  conn,
}: IServerObject) {
  const methodMetadatas: MethodMetadata = Reflect.getMetadata(
    REQ_PARAM_KEY,
    controller,
    methodName);
  if (!methodMetadatas) return [];
  /** Decorator loads params in reverse order .*/
  let reverseIndex = methodMetadatas.length - 1;
  const params: any[] = [];
  for (reverseIndex; reverseIndex >= 0; reverseIndex--) {
    const [paramTagEnum, paramName] = methodMetadatas[reverseIndex];

    if (paramTagEnum === ParamTag.REQ) {
      params.push(req);
    } else if (!!res && paramTagEnum === ParamTag.RES) {
      params.push(res);
    } if (!!next && paramTagEnum === ParamTag.NEXT) {
      params.push(next);
    } if (paramTagEnum === ParamTag.BODY) {
      params.push(req.body);
    } else if (paramTagEnum === ParamTag.WS_CONNECTION) {
      params.push(conn);
    } else if (paramName) {
      const reqMap =
        req[mapTagToReqParam(paramTagEnum)] as Record<string, string>;
      params.push(reqMap[paramName]);
    }
  }
  return params;
}
