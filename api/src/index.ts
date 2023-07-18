import 'reflect-metadata';
import { Application } from './application/Application';
import { configuration } from './environment';
import { Infrastructure } from './infrastructure/Infrastructure';

function main() {
  void Infrastructure.init()
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
  Application.init();
  Application.listen(configuration.api.port, () => {
    console.info('================================================');
    console.info(`Server is running at ${configuration.api.host}`);
    console.info('================================================');
  });
}
main();
