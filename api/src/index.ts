import 'reflect-metadata';
import application, { appControllers, appWebsocket } from './application/application';
import { configuration } from './environment';
import infrastructure from './infrastructure/Infrastructure';

async function main() {
  await infrastructure.init()
    .then(() => {
      console.info('================================================');
      console.info('Database connected');
      console.info('================================================');
    });
  await application.init({
    basePrefix: '/api',
    logger: console,
    controllers: appControllers,
    websockets: appWebsocket,
  });
  application.listen(configuration.api.port, () => {
    console.info('================================================');
    console.info(`Server is running at ${configuration.api.host}`);
    console.info('================================================');
  });
}
main();
