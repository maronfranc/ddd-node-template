import { IDomainException } from "../../domain/library/exceptions/domain.exception";
import { IInitOption, ILogger, IWebsocketGateway } from "../application.interfaces";
import { PATH_METADATA } from "../library/decorators";
import { IEndpoint } from "../library/interfaces/endpoint.interface";
import { addMissingSlashToPath } from "../library/utils/format";
import { getDecoratedParams } from "./fastify.application";
import { FastifyApp, FastifyWebsocketFunction } from "./fastify.interface";

export class WebsocketLoader {
  private basePrefix = '';
  private logger?: ILogger;
  private WsGateways?: IWebsocketGateway[];

  public init(opt?: IInitOption): this {
    this.logger = opt?.logger;
    this.basePrefix = opt?.basePrefix ?? this.basePrefix;
    this.WsGateways = opt?.websockets;
    return this;
  }

  /** loader to be run in fastify.register */
  public load(app: FastifyApp) {
    if (!Array.isArray(this.WsGateways)) return;
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
      const { error, result: params } = getDecoratedParams({
        controller,
        methodName,
        req,
        conn,
      });
      if (error) {
        conn.send(JSON.stringify(error));
        return conn.close();
      }
      // conn.send(JSON.stringify({ message: "Connection success" }));

      try {
        conn.on('error', (err) => {
          const errMsg: IDomainException = {
            detail: err.message,
            statusName: 'INTERNAL_SERVER_ERROR',
          };
          conn.send(JSON.stringify(errMsg))
        });

        conn.on('close', (code, data) => {
          const error: any = {
            detail: `Connection closed with code ${code}`,
            data,
          };
          conn.send(JSON.stringify(error));
        });

        const response = await controller[methodName](...params);
        conn.send(JSON.stringify(response));
      } catch (err: any) {
        conn.send(err);
      }
    }
  }
}

export default new WebsocketLoader();
