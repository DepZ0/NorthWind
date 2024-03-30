import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { SuppliersService } from "../services/suppliersService";

export class SuppliersController extends Controller {
  constructor(private suppliersService: SuppliersService) {
    super("/suppliers");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
    this.router.get("/:id", this.getById);
  };

  private getAll: RequestHandler = async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const suppliers = await this.suppliersService.getAllSuppliers(page);
    return res.status(200).json(suppliers);
  };

  private getById = async (req, res) => {
    const id = Number(req.params.id);
    const supplier = await this.suppliersService.getSuplierById(id);
    return res.status(200).json(supplier);
  };
}
