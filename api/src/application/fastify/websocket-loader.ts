import { IInitOption, ILogger, IWebsocketGateway } from "../application.interfaces";
import { HealthcheckWebsocket } from "../controller/healthcheck/healthcheck.websocket";
import { TodoListWebsocket } from "../controller/todo-list/todo-list.websocket";
import { PATH_METADATA } from "../library/decorators";
import { IEndpoint } from "../library/interfaces/endpoint.interface";
import { addMissingSlashToPath } from "../library/utils/format";
import { getDecoratedParams } from "./fastify.application";
import { FastifyApp, FastifyWebsocketFunction } from "./fastify.interface";

export class WebsocketLoader {
  private logger: ILogger = console;

  private WsGateways: IWebsocketGateway[] = [
    HealthcheckWebsocket,
    TodoListWebsocket,
  ];

  public init(opt?: IInitOption): this {
    this.logger = opt?.logger ?? this.logger;
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
    let path = Reflect.getMetadata(PATH_METADATA, WebsocketGateway) as string;
    this.logger?.info(`- Loading routes: ${path ? path : '<root>'}`);
    path = addMissingSlashToPath(path);
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
        { beforeHandler: route.middlewares, websocket: true },
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
      conn.send(JSON.stringify({ message: "Connection success" }));
      const response = await controller[methodName](...params);
      conn.send(JSON.stringify(response));
    }
  }
}

export default new WebsocketLoader();
