import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { employees } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class EmployeesDb {
  constructor(private db: NodePgDatabase) {}
  public getAllEmployees = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const employees_db = await this.db.select().from(employees).limit(pageSize).offset(offset);

    const query = await this.db.select().from(employees).limit(pageSize).offset(offset).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(employees);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const employeesQuery = this.db.select().from(employees).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: employeesQuery, timestamp, duration };

    return { employees_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getEmployeeById = async (id: string) => {
    const employeeId = await this.db.select().from(employees).where(eq(employees.employeeId, id));

    const query = await this.db.select().from(employees).where(eq(employees.employeeId, id)).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const employeeIdQuery = await this.db.select().from(employees).where(eq(employees.employeeId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: employeeIdQuery, timestamp, duration };

    return { employeeId, responseQuery };
  };
}
