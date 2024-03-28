import { ExpressApplication } from "./express/express.application";
// import { FastifyApplication } from "./fastify/fastify.application";

class Application extends ExpressApplication { }
// class Application extends FastifyApplication { }

export default new Application();
