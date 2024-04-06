import { IController, IInitOption, ILogger } from "../application.interfaces";
import { AuthController } from "../controller/auth/auth.controller";
import { HealthcheckController } from "../controller/healthcheck/healthcheck.controller";
import { TodoListController } from "../controller/todo-list/todo-list.controller";
import { PATH_METADATA } from "../library/decorators";
import { addMissingSlashToPath } from "../library/utils/format";
import { IEndpoint } from "../library/interfaces/endpoint.interface";
import { FastifyHttpVerb, RequestMethod } from "../library/interfaces/request-method";
import { FastifyApp, FastifyRouteFunction } from "./fastify.interface";
import { getDecoratedParams } from "./fastify.application";

export class ControllerLoader {
  private basePrefix = '';
  private logger?: ILogger
  private Controllers: IController[] = [
    AuthController,
    HealthcheckController,
    TodoListController,
  ];

  public init(opt?: IInitOption): this {
    this.logger = opt?.logger;
    this.basePrefix = opt?.basePrefix ?? this.basePrefix;
    return this;
  }

  /** loader to be run in fastify.register */
  public load(app: FastifyApp) {
    for (const Controller of this.Controllers) {
      this.loadControllerRoutes(app, Controller);
    }
  }

  private loadControllerRoutes(app: any, Controller: IController) {
    const controller = new Controller();
    let path = Reflect.getMetadata(PATH_METADATA, Controller) as string;
    this.logger?.info(`- Loading routes: ${path ? path : '<root>'}`);
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const httpVerb = this.mapEnumToFunctionName(route.method);
      const routePath = addMissingSlashToPath(route.path);
      const completePath = `${this.basePrefix}${path}${routePath}`;
      this.logger?.info(`\t- Endpoint | ${httpVerb.padEnd(5)}| loaded: ${completePath}`);
      if (typeof app[httpVerb] !== "function") {
        throw new Error(
          `Error loading fastify function.
          1. Variable "${httpVerb}" need to be an fastify function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.`);
      }
      const controllerMethodRoute = this.controllerMethodWrapper(
        controller,
        methodName);

      app[httpVerb](
        completePath,
        {
          preHandler: route.middlewares,
          handler: controllerMethodRoute,
        },
      );
    }
  }

  private controllerMethodWrapper(
    controller: any,
    methodName: string,
  ): FastifyRouteFunction {
    return async (req, res, next) => {
      const { error, result: params } = getDecoratedParams({
        controller,
        methodName,
        req,
        res,
        next,
      });
      if (error) return next(error);

      const response = await controller[methodName](...params);
      return res.send(response);
    }
  }

  private mapEnumToFunctionName(methodEnum: RequestMethod): FastifyHttpVerb {
    const map = new Map<RequestMethod, FastifyHttpVerb>([
      [RequestMethod.GET, 'get'],
      [RequestMethod.POST, 'post'],
      [RequestMethod.PUT, 'put'],
      [RequestMethod.DELETE, 'delete'],
      [RequestMethod.PATCH, 'patch'],
      [RequestMethod.ALL, 'all'],
    ]);
    const fastifyFunction = map.get(methodEnum);
    if (!fastifyFunction) {
      throw new Error('Method not implemented in map');
    }
    return fastifyFunction;
  }
}

export default new ControllerLoader();
