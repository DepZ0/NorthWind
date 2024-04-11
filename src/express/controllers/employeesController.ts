import { RequestHandler } from "express";
import { Controller } from "./Controller";
import { EmployeesService } from "../services/employeesService";
import { z } from "zod";

export class EmployeesController extends Controller {
  constructor(private employeesService: EmployeesService) {
    super("/employees");
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.getAll);
    this.router.get("/:id", this.getById);
  };

  private getAll: RequestHandler = async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const employees = await this.employeesService.getAllEmployees(page);
    return res.status(200).json(employees);
  };

  idSchema = z.string();

  private getById: RequestHandler = async (req, res) => {
    const id = String(req.params.id).toUpperCase();

    const parsed = this.idSchema.safeParse(id);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const employee = await this.employeesService.getEmployeeById(id);
    return res.status(200).json(employee);
  };
}
