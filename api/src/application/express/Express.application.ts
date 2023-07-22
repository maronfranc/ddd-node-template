import express, { Express, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DomainException } from '../../domain/library/exceptions/domain.exception';
import { AuthController } from '../controller/auth/Auth.controller';
import { ExampleController } from '../controller/example/Example.controller';
import { HealthcheckController } from '../controller/healthcheck/Healthcheck.controller';
import { PATH_METADATA } from '../library/decorators/decorator.constants';
import { HttpStatus } from '../library/http/http-status.enum';
import { IEndpoint } from '../library/interfaces/IEndpoint';
import { RequestMethod, RequestMethodName } from '../library/interfaces/request-method';
import { addMissingSlashToPath } from '../library/utils/format';
import { Next, Req, Res } from './Express.interfaces';
import { openApi } from './openapi';

type IController = { new(): any };

export class ExpressApplication {
  public app: Express;
  private logger = console;
  private Controllers: IController[] = [
    AuthController,
    ExampleController,
    HealthcheckController,
  ];

  /** Init routes and middlewares. */
  public constructor() {
    this.app = express();
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }));
    this.loadSwagger();
    this.controllerRoutes();
    this.app.all("*", this.routeNotFound);
    this.app.use(this.errorMiddleware);
  }

  public listen(port: number, callback: () => void) {
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

  private errorMiddleware(error: DomainException, _req: Req, res: Res, _next: Next) {
    const errorCode = HttpStatus[error?.statusName] ?? HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(errorCode).json(error);
  }

  private mapEnumToFunctionName(methodEnum: RequestMethod): RequestMethodName {
    const map = new Map<RequestMethod, RequestMethodName>([
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
    this.logger.info(`- Loading routes: ${path ? path : '<root>'}`);
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const expressFunctionName = this.mapEnumToFunctionName(route.method);
      const routePath = addMissingSlashToPath(route.path);
      this.logger.info(`\t- Endpoint | ${expressFunctionName.padEnd(5)}| loaded: ${path}${routePath ? routePath : '<root>'}`);
      if (typeof controllerSubRouter[expressFunctionName] !== "function") {
        throw new Error(
          `Error loading express function.
          1. Variable "${expressFunctionName}" need to be an express function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.`);
      }
      if (Array.isArray(route.middlewares) && route.middlewares.length >= 1) {
        controllerSubRouter[expressFunctionName](
          routePath,
          route.middlewares,
          controller[methodName],
        );
      } else {
        controllerSubRouter[expressFunctionName](
          routePath,
          controller[methodName],
        );
      }
    }
    this.app.use(path, controllerSubRouter);
  }

  private loadSwagger() {
    const route = '/api-docs';
    this.logger.info(`- Loading openApi route: ${route}`);
    this.app.use(route, swaggerUi.serve, swaggerUi.setup(openApi));
  }
}
