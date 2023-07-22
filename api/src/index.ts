import 'reflect-metadata';
import application from './application/Application';
import { configuration } from './environment';
import infrastructure from './infrastructure/Infrastructure';

function main() {
  void infrastructure.init()
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
  application.init({ logger: console });
  application.listen(configuration.api.port, () => {
    console.info('================================================');
    console.info(`Server is running at ${configuration.api.host}`);
    console.info('================================================');
  });
}
main();
