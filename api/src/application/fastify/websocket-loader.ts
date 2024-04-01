import { DomainException } from "../../domain/library/exceptions/domain.exception";
import { IInitOption, ILogger, IWebsocketGateway } from "../application.interfaces";
import { HealthcheckWebsocket } from "../controller/healthcheck/healthcheck.websocket";
import { TodoListWebsocket } from "../controller/todo-list/todo-list.websocket";
import { PATH_METADATA } from "../library/decorators";
import { IEndpoint } from "../library/interfaces/endpoint.interface";
import { addMissingSlashToPath } from "../library/utils/format";
import { getDecoratedParams } from "./fastify.application";
import { FastifyApp, FastifyWebsocketFunction } from "./fastify.interface";

export class WebsocketLoader {
  private basePrefix = '';
  private logger?: ILogger;

  private WsGateways: IWebsocketGateway[] = [
    HealthcheckWebsocket,
    TodoListWebsocket,
  ];

  public init(opt?: IInitOption): this {
    this.logger = opt?.logger;
    this.basePrefix = opt?.basePrefix ?? this.basePrefix;
    return this;
  }

  /** loader to be run in fastify.register */
  public load(app: FastifyApp) {
    for (const Controller of this.WsGateways) {
      this.loadControllerRoutes(app, Controller);
    }
  }

  private loadControllerRoutes(app: any, WebsocketGateway: IWebsocketGateway) {
    const gateway = new WebsocketGateway();
    let controllerPath = Reflect.getMetadata(PATH_METADATA, WebsocketGateway) as string;
    controllerPath = addMissingSlashToPath(controllerPath);
    const path = `${this.basePrefix}${controllerPath}`;
    this.logger?.info(`- Loading routes: ${path ? path : '<root>'}`);
    const methodNames = Reflect.getMetadataKeys(gateway);
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, gateway) as IEndpoint;
      const routePath = addMissingSlashToPath(route.path);
      this.logger?.info(`\t- Websocket | get | loaded: ${path}${routePath ? routePath : '<root>'}`);
      const gatewayMethodRoute = this.getwayMethodWrapper(
        gateway,
        methodName);
      const completePath = `${path}${routePath}`;
      app.get(
        completePath,
        { preHandler: route.middlewares, websocket: true },
        gatewayMethodRoute,
      );
    }
  }

  private getwayMethodWrapper(
    controller: any,
    methodName: string,
  ): FastifyWebsocketFunction {
    return async (conn, req) => {
      const params = getDecoratedParams({
        controller,
        methodName,
        req,
        conn,
      });
      // conn.send(JSON.stringify({ message: "Connection success" }));

      conn.on('error', (err) => {
        const errMsg = new DomainException({
          detail: err.message,
          statusName: 'INTERNAL_SERVER_ERROR',
        });
        conn.send(JSON.stringify(errMsg))
      });

      conn.on('close', (code, data) => {
        const errMsg: any = { message: `Connection closed with code ${code}` };
        if (data) errMsg.data = data;
        conn.send(JSON.stringify(errMsg));
      });

      const response = await controller[methodName](...params);
      conn.send(JSON.stringify(response));
    }
  }
}

export default new WebsocketLoader();
