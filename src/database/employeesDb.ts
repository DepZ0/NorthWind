import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { employees } from "../schema";
import { eq, sql } from "drizzle-orm";

export class EmployeesDb {
  constructor(private db: NodePgDatabase) {}
  public getAllEmployees = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const startDate = new Date().getTime();
    const employees_db = await this.db.select().from(employees).limit(pageSize).offset(offset);
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(employees);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const employeesQuery = this.db.select().from(employees).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: employeesQuery, timestamp, duration };

    return { employees_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getEmployeeById = async (id: string) => {
    const startDate = new Date().getTime();
    const employeeId = await this.db.select().from(employees).where(eq(employees.employeeId, id));
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const employeeIdQuery = await this.db.select().from(employees).where(eq(employees.employeeId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: employeeIdQuery, timestamp, duration };

    return { employeeId, responseQuery };
  };
}
