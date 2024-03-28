import express, { Express, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DomainException } from '../../domain/library/exceptions/domain.exception';
import { IController, IInitOption, ILogger } from '../application.interfaces';
import { AuthController } from '../controller/auth/auth.controller';
import { ExampleController } from '../controller/example/example.controller';
import { HealthcheckController } from '../controller/healthcheck/healthcheck.controller';
import { PATH_METADATA } from '../library/decorators/decorator.constants';
import { HttpStatus } from '../library/http/http-status.enum';
import { IEndpoint } from '../library/interfaces/endpoint.interface';
import { RequestMethod } from '../library/interfaces/request-method';
import { addMissingSlashToPath } from '../library/utils/format';
import { ExpressHttpVerb, ExpressRouteFunction, Next, Req, Res } from './express.interfaces';
import { openApi } from './openapi';
import { TodoListController } from '../controller/todo-list/todo-list.controller';
import { MethodMetadata, ParamTag, REQ_PARAM_KEY } from '../library/decorators/route-params';
import { domainException } from '../../domain/library/exceptions/exception-map';

export class ExpressApplication {
  public app: Express;
  private Controllers: IController[] = [
    AuthController,
    ExampleController,
    HealthcheckController,
    TodoListController,
  ];
  private logger?: ILogger;

  public constructor() {
    this.app = express();
  }

  /** Init routes and middlewares. */
  public init(opts?: IInitOption) {
    this.logger = opts?.logger;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.loadSwagger();
    this.controllerRoutes();
    this.app.all("*", this.routeNotFound);
    this.app.use(this.errorMiddleware);
  }

  public async listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }

  private controllerRoutes() {
    for (const Controller of this.Controllers) {
      this.loadControllerRoutes(Controller);
    }
  }

  private routeNotFound(_: Req, res: Res) {
    const message = { detail: "Route not found" };
    return res.status(HttpStatus.NOT_FOUND).send(message);
  }

  private errorMiddleware(error: DomainException | any, _req: Req, res: Res, _next: Next) {
    const errorCode = Number(HttpStatus[error?.statusName])
      ?? HttpStatus.INTERNAL_SERVER_ERROR;
    if (!(error instanceof Error)) {
      return res.status(Number(errorCode)).json(error);
    }

    const { name, message, stack, cause } = error;
    return res.status(errorCode)
      .json({ name, message, stack, cause });
  }

  private mapEnumToFunctionName(methodEnum: RequestMethod): ExpressHttpVerb {
    const map = new Map<RequestMethod, ExpressHttpVerb>([
      [RequestMethod.GET, 'get'],
      [RequestMethod.POST, 'post'],
      [RequestMethod.PUT, 'put'],
      [RequestMethod.DELETE, 'delete'],
      [RequestMethod.PATCH, 'patch'],
      [RequestMethod.ALL, 'use'],
    ]);
    const expressFunction = map.get(methodEnum);
    if (!expressFunction) {
      throw new Error('Method not implemented in map');
    }
    return expressFunction;
  }

  private loadControllerRoutes(Controller: IController) {
    const controllerSubRouter = Router();
    const controller = new Controller();
    let path = Reflect.getMetadata(PATH_METADATA, Controller) as string;
    this.logger?.info(`- Loading routes: ${path ? path : '<root>'}`);
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const httpVerb = this.mapEnumToFunctionName(route.method);
      const routePath = addMissingSlashToPath(route.path);
      this.logger?.info(`\t- Endpoint | ${httpVerb.padEnd(5)}| loaded: ${path}${routePath ? routePath : '<root>'}`);
      if (typeof controllerSubRouter[httpVerb] !== "function") {
        throw new Error(
          `Error loading express function.
          1. Variable "${httpVerb}" need to be an express function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.`);
      }

      const controllerMethodRoute = this.controllerMethodWrapper(
        controller,
        methodName);
      if (Array.isArray(route.middlewares) && route.middlewares.length >= 1) {
        controllerSubRouter[httpVerb](
          routePath,
          route.middlewares,
          controllerMethodRoute);
      } else {
        controllerSubRouter[httpVerb](routePath, controllerMethodRoute);
      }
    }
    this.app.use(path, controllerSubRouter);
  }

  private mapTagToReqParam(paramTag: ParamTag): keyof Req {
    if (paramTag === ParamTag.PARAM) return 'params';
    if (paramTag === ParamTag.BODY) return 'body';
    if (paramTag === ParamTag.QUERY) return 'query';
    throw new DomainException(domainException['internal-server-error']);
  }

  private controllerMethodWrapper(
    controller: any,
    methodName: string,
  ): ExpressRouteFunction {
    return async (req, res, next) => {
      try {
        const params = this.getDecoratedParams(
          controller,
          methodName,
          req,
          res,
          next);
        const response = await controller[methodName](...params);
        return res.send(response);
      } catch (err: any) {
        return next(err);
      }
    }
  }

  private getDecoratedParams(
    controller: IController,
    methodName: string,
    req: Req,
    res: Res,
    next: Next,
  ) {
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
      } else if (paramTagEnum === ParamTag.RES) {
        params.push(res);
      } if (paramTagEnum === ParamTag.NEXT) {
        params.push(next);
      } if (paramTagEnum === ParamTag.BODY) {
        params.push(req.body);
      } else if (paramName) {
        const reqMap = req[this.mapTagToReqParam(paramTagEnum)];
        params.push(reqMap[paramName]);
      }
    }
    return params;
  }

  private loadSwagger() {
    const route = '/api-docs';
    this.logger?.info(`- Loading openApi route: ${route}`);
    this.app.use(route, swaggerUi.serve, swaggerUi.setup(openApi));
  }
}

