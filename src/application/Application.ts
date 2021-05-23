import express, { Express, Router } from 'express'
import { addMissingSlashToPath } from './utils/formatRouteUrl';
import { isFunction } from './utils/isFunction';
import { ExampleController } from './controller/Example.controller';
import { PATH_METADATA } from './library/decorators/decorator.constants';
import { IEndpoint } from './library/interfaces/IEndpoint';
import { RequestMethod } from './library/interfaces/request-method';

type IController = {
  new(): any
};

export class Application {
  private logger = console;
  private app: Express;
  private router: Router;
  private Controllers: IController[] = [
    ExampleController
  ];
  public constructor() {
    this.app = express();
    this.router = express.Router();
  }
  public listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }
  public routes() {
    for (const Controller of this.Controllers) {
      this.loadRoutes(Controller);
    }
  }
  private mapEnumToFunctionName(methodEnum: RequestMethod): keyof Router {
    const map = new Map<RequestMethod, Partial<(keyof Router)>>([
      [RequestMethod.GET, 'get'],
      [RequestMethod.POST, 'post'],
      [RequestMethod.PUT, 'put'],
      [RequestMethod.DELETE, 'delete'],
      [RequestMethod.PATCH, 'patch'],
      [RequestMethod.ALL, 'use'],
    ]);
    const expressFunction = map.get(methodEnum);
    if (expressFunction === undefined) {
      throw new Error('Method not implemented in map');
    }
    return expressFunction;
  }
  private loadRoutes(Controller: any) {
    const controller = new Controller();
    let path = Reflect.getMetadata(PATH_METADATA, Controller) as string;
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    this.logger.info(`Loading endpoints: ${path ? path : '<root>'}`)
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const expressFunctionName = this.mapEnumToFunctionName(route.method);
      const routePath = addMissingSlashToPath(route.path);
      this.logger.info(`  - Endpoint loaded:, ${path}${routePath ? routePath : '<root>'}`);
      if (!isFunction(this.router[expressFunctionName])) {
        throw new Error(
          `Error loading express function.
          1. Variable "${expressFunctionName}" need to be an express function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.
          `);
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
}
