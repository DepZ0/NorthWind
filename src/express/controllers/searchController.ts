import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { SearchService } from "../services/searchService";

export class SearchController extends Controller {
  constructor(private searchProductsService: SearchService) {
    super("/search");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
  };

  private getAll: RequestHandler = async (req, res) => {
    const table = String(req.query.table).toLowerCase();

    const searchName = req.query.q ? String(req.query.q) : "";
    const page = req.query.page ? Number(req.query.page) : 1;

    if (table == "products") {
      const searchResult = await this.searchProductsService.getAllProductSearchResult(searchName, page);
      return res.status(200).json(searchResult);
    }

    if (table == "customers") {
      const searchResult = await this.searchProductsService.getAllCustomersSearchResult(searchName, page);
      return res.status(200).json(searchResult);
    } else {
      return res.send("Incorrect table, try /search?q=TEXT&table=products -OR- &table=customers");
    }
  };
}
