import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { employees } from "../schema";
import { eq } from "drizzle-orm";

export class EmployeesDb {
  constructor(private db: NodePgDatabase) {}
  public getAllEmployees = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const employees_db = await this.db.select().from(employees).limit(pageSize).offset(offset);
    return employees_db;
  };

  public getEmployeeById = async (id: string) => {
    const employeeId = await this.db.select().from(employees).where(eq(employees.employeeId, id));
    return employeeId;
  };
}
