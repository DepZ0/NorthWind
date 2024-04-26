import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { employees } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";
import { getExecutionTime } from "../util/query";

export class EmployeesDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public getAllEmployees = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const employeesDb = await this.db.select().from(employees).limit(pageSize).offset(offset);
    const databaseResult = employeesDb.map((employees) => {
      return { ...employees, region: undefined };
    });

    const query = this.db.select().from(employees).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(employees);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { employeesDb: databaseResult, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getEmployeeById = async (id: string) => {
    const employeeId = await this.db.select().from(employees).where(eq(employees.employeeId, id));
    const databaseResult = employeeId.map((employees) => {
      return { ...employees, region: undefined };
    });

    const query = this.db.select().from(employees).where(eq(employees.employeeId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { databaseResult, responseQuery };
  };
}
