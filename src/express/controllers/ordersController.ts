import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { OrdersService } from "../services/ordersService";
import { z } from "zod";

export class OrdersController extends Controller {
  constructor(private ordersService: OrdersService) {
    super("/orders");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
    this.router.get("/:id", this.getById);
  };

  private getAll: RequestHandler = async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const orders = await this.ordersService.getAllOrders(page);
    return res.status(200).json(orders);
  };

  idSchema = z.number();

  private getById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);

    const parsed = this.idSchema.safeParse(id);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const order = await this.ordersService.getOrderById(id);
    return res.status(200).json(order);
  };
}
