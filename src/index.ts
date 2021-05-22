import 'reflect-metadata'
import { Application } from './application/Application';

function bootStrap() {
  const PORT = 4001;
  const application = new Application();
  application.routes();
  application.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
  });
}
bootStrap();
