import 'reflect-metadata'
import { Application } from './application/Application';
import { Infrastructure } from './infrastructure';

function main() {
  const PORT = 4001;
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
  application.listen(PORT, () => {
    console.info('================================================');
    console.info(`Server is running at https://localhost:${PORT}`);
    console.info('================================================');
  });
}
main();
