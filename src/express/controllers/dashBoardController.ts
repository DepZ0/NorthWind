import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { DashBoardService } from "../services/dashBoardService";
import axios from "axios";

export class DashBoardController extends Controller {
  constructor(private dashBoardService: DashBoardService) {
    super("/dashboard");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
  };

  private getAll: RequestHandler = async (req, res) => {
    const ip = req.headers["x-forwarded-for"];
    const ip_info = await axios.get(`https://api.northwind.d1sql.com/api/status`);

    const ip_response = JSON.stringify(ip_info.data.cf.country); // country and colo
    console.log(ip_response);

    return res.send(ip_response);
  };
}
