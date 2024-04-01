import { FastifyApplication } from "./fastify/fastify.application";
class Application extends FastifyApplication { }

// import { ExpressApplication } from "./express/express.application";
// class Application extends ExpressApplication { }

export default new Application();
