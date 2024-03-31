import 'reflect-metadata';
import application from './application/application';
import { configuration } from './environment';
import infrastructure from './infrastructure/Infrastructure';

async function main() {
  await infrastructure.init()
    .then(() => {
      console.info('================================================');
      console.info('Database connected');
      console.info('================================================');
    })
    .catch((error) => {
      console.info('================================================');
      console.info('Database connection error', error);
      console.info('================================================');
    });
  application.init({ basePrefix: '/api', logger: console });
  application.listen(configuration.api.port, () => {
    console.info('================================================');
    console.info(`Server is running at ${configuration.api.host}`);
    console.info('================================================');
  });
}
main();
