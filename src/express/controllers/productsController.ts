import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { ProductsService } from "../services/productsService";

export class ProductsController extends Controller {
  constructor(private productsService: ProductsService) {
    super("/products");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
    this.router.get("/:id", this.getById);
  };

  private getAll: RequestHandler = async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const products = await this.productsService.getAllProducts(page);
    return res.status(200).json(products);
  };

  private getById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const product = await this.productsService.getProductById(id);
    return res.status(200).json(product);
  };
}
