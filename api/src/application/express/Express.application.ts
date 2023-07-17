import express, { Express, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { DomainException } from '../../domain/library/exceptions/domain.exception';
import { AuthController } from '../controller/auth/Auth.controller';
import { ExampleController } from '../controller/example/Example.controller';
import { PATH_METADATA } from '../library/decorators/decorator.constants';
import { HttpStatus } from '../library/http/http-status.enum';
import { IEndpoint } from '../library/interfaces/IEndpoint';
import { RequestMethod } from '../library/interfaces/request-method';
import { addMissingSlashToPath } from '../library/utils/format';
import { Next, Req, Res } from './Express.interfaces';
import { openApi } from './openapi';

type IController = {
  new(): any
};

export class ExpressApplication {
  public static app: Express;
  private static logger = console;
  private static router: Router;
  private static Controllers: IController[] = [
    ExampleController,
    AuthController
  ];
  public static listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }
  /** Init routes and middlewares. */
  public static init() {
    this.app = express();
    this.router = express.Router();
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }));
    this.loadSwagger();
    this.controllerRoutes();
    this.app.all("*", this.routeNotFound);
    this.app.use(this.errorMiddleware);
  }
  private static controllerRoutes() {
    for (const Controller of this.Controllers) {
      this.loadControllerRoutes(Controller);
    }
  }
  private static routeNotFound(_: Req, res: Res): void {
    res.status(HttpStatus.NOT_FOUND).send({
      detail: "Route not found"
    });
  }
  private static errorMiddleware(error: DomainException, _req: Req, res: Res, _next: Next) {
    return res.status(HttpStatus[error.statusName] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
  private static mapEnumToFunctionName(methodEnum: RequestMethod): keyof Router {
    const map = new Map<RequestMethod, Partial<(keyof Router)>>([
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
  private static loadControllerRoutes(Controller: any) {
    const controller = new Controller();
    let path = Reflect.getMetadata(PATH_METADATA, Controller) as string;
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    this.logger.info(`- Loading routes: ${path ? path : '<root>'}`)
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const expressFunctionName = this.mapEnumToFunctionName(route.method);
      const routePath = addMissingSlashToPath(route.path);
      this.logger.info(`\t- Endpoint | ${expressFunctionName.padEnd(5)}| loaded: ${path}${routePath ? routePath : '<root>'}`);
      if (typeof this.router[expressFunctionName] !== "function") {
        throw new Error(
          `Error loading express function.
          1. Variable "${expressFunctionName}" need to be an express function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.`);
      }
      if (Array.isArray(route.middlewares) && route.middlewares.length >= 1) {
        (this.router[expressFunctionName] as CallableFunction)(
          routePath,
          route.middlewares,
          controller[methodName]
        );
      } else {
        (this.router[expressFunctionName] as CallableFunction)(routePath, controller[methodName]);
      }
    }
    this.app.use(addMissingSlashToPath(path), this.router);
  }
  private static loadSwagger() {
    const route = '/api-docs';
    this.logger.info(`- Loading openApi route: ${route}`);
    this.app.use(route, swaggerUi.serve, swaggerUi.setup(openApi));
  }
}
