import { EmployeesDb } from "../../database/employeesDb";

export class EmployeesService {
  constructor(private employeesDb: EmployeesDb) {}
  public getAllEmployees = async (page: number) => {
    const pageSize = 20;
    const allEmployees = await this.employeesDb.getAllEmployees(page, pageSize);
    return allEmployees;
  };

  public getEmployeeById = async (id: string) => {
    const employeeId = await this.employeesDb.getEmployeeById(id);
    return employeeId;
  };
}
