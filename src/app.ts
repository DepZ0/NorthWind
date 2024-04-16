import express, { Application } from "express";
import { Controller } from "./express/controllers/Controller";
import { ZodError } from "zod";
import "express-async-errors";

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

    this.app.use((err, req, res, next) => {
      if (err instanceof ZodError) {
        return res.status(422).json({ error: err.message });
      }

      return res.status(500).json({ error: "Something went wrong" });
    });
  };

  public start = () => {
    this.app.listen(this.port, () => {
      console.log(`The server is running on port ${this.port}`);
    });
  };
}
