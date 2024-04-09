import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { CustomersService } from "../services/customersSevice";

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

  private getById = async (req, res) => {
    // you should add validation on id
    // you can use valibot, zod or typebox. Or whatever you will find
    const id = String(req.params.id).toUpperCase();
    const customer = await this.customersService.getCustomerById(id);
    return res.status(200).json(customer);
  };
}
