import express, { Express, Router } from "express"

export class Application {
  private app: Express;
  private router: Router;
  public constructor() {
    this.app = express();
    this.router = express.Router();
  }
  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running at https://localhost:${port}`);
    });
  }
}
