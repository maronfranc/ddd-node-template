import 'reflect-metadata';
import { Application } from './application/Application';
import { configuration } from './environment';
import { Infrastructure } from './infrastructure/Infrastructure';

function main() {
  const infrastructure = new Infrastructure();
  infrastructure.init({
    onConnected: () => {
      console.info('================================================');
      console.info('Database connected');
      console.info('================================================');
    },
    onError: (error) => {
      console.info('================================================');
      console.info('Database connection error', error);
      console.info('================================================');
      const WITH_ERROR = 1;
      process.exit(WITH_ERROR);
    }
  });
  const application = new Application();
  application.init();
  application.listen(configuration.api.port, () => {
    console.info('================================================');
    console.info(`Server is running at ${configuration.api.host}`);
    console.info('================================================');
  });
}
main();
