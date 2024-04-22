import { AuthController } from "./controller/auth/auth.controller";
import { HealthcheckController } from "./controller/healthcheck/healthcheck.controller";
import { HealthcheckWebsocket } from "./controller/healthcheck/healthcheck.websocket";
import { TodoListController } from "./controller/todo-list/todo-list.controller";
import { TodoListWebsocket } from "./controller/todo-list/todo-list.websocket";
import { FastifyApplication } from "./fastify/fastify.application";
class Application extends FastifyApplication { }

// import { ExpressApplication } from "./express/express.application";
// class Application extends ExpressApplication { }

export default new Application();

export const appControllers = [
  AuthController,
  HealthcheckController,
  TodoListController,
];

export const appWebsocket = [
  HealthcheckWebsocket,
  TodoListWebsocket,
]
