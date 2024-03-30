import express, { Application } from "express";
import { Controller } from "./express/controllers/Controller";

export class App {
  public app: Application;
  constructor(private port: number, private controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers();
  }

  private initializeMiddlewares = () => {
    this.app.use(express.json());
  };

  private initializeControllers = () => {
    this.controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  };

  public start = () => {
    this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  };
}
