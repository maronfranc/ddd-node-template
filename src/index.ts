import 'reflect-metadata'
import { Application } from './application/Application';

function main() {
  const PORT = 4001;
  const application = new Application();
  application.routes();
  application.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
  });
}
main();
