import express, { Express, Router } from "express"
import { addMissingSlashToPath } from "../utils/formatRouteUrl";
import { isFunction } from "../utils/isFunction";
import { AuthController } from "./Auth/Auth";
import { PATH_METADATA } from "./library/decorators/decorator.constants";
import { IEndpoint } from "./library/IEndpoint";
import { RequestMethod } from "./library/request-method";

export class Application {
  private logger = console;
  private app: Express;
  private router: Router;
  private Controllers = [];
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
      [RequestMethod.GET, "get"],
      [RequestMethod.POST, "post"],
      [RequestMethod.PUT, "put"],
      [RequestMethod.DELETE, "delete"],
      [RequestMethod.PATCH, "patch"],
      [RequestMethod.ALL, "use"],
    ]);
    const expressFunction = map.get(methodEnum);
    if (expressFunction === undefined) {
      throw new Error("Method not implemented in map");
    }
    return expressFunction;
  }
  private loadRoutes(Controller: any) {
    const controller = new Controller();
    let path = Reflect.getMetadata(PATH_METADATA, Controller) as IEndpoint['path'];
    path = addMissingSlashToPath(path);
    const methodNames = Reflect.getMetadataKeys(controller);
    this.logger.info(`Loading endpoint inside: ${path ? path : "<root>q"}`)
    for (const methodName of methodNames) {
      const route = Reflect.getMetadata(methodName, controller) as IEndpoint;
      const expressFunctionName = this.mapEnumToFunctionName(route.method);
      this.logger.info("- Endpoint loaded:", route.path ? route.path : "<root>");
      if (!isFunction(this.router[expressFunctionName])) {
        throw new Error(
          `Error loading express function.
          1. Variable "${expressFunctionName}" need to be an express function.
          2. Check if function name is correctly listed in function map.
          3. Check if method enum is correctly listed in function map.
          `);
      }
      // TODO: add middlewaress  
      (this.router[expressFunctionName] as CallableFunction)(route.path, controller[methodName]);
    }
    this.app.use(addMissingSlashToPath(path), this.router);
  }
}
