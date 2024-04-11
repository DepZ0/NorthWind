import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { CustomersService } from "../services/customersSevice";
import { z } from "zod";

export class CustomersController extends Controller {
  constructor(private customersService: CustomersService) {
    super("/customers");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
    this.router.get("/:id", this.getById);
  };

  private getAll: RequestHandler = async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;

    const suppliers = await this.customersService.getAllCustomers(page);

    return res.status(200).json(suppliers);
  };

  idSchema = z.string();

  private getById = async (req, res) => {
    const id = String(req.params.id).toUpperCase();

    const parsed = this.idSchema.safeParse(id);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const customer = await this.customersService.getCustomerById(id);
    return res.status(200).json(customer);
  };
}
