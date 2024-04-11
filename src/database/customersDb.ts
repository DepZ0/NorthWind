import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

export class CustomersDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public getAllCustomers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const customersDb = await this.db.select().from(customers).limit(pageSize).offset(offset);

    const query = await this.db.select().from(customers).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(customers);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { customersDb: customersDb, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getCustomerById = async (id: string) => {
    const customerId = await this.db.select().from(customers).where(eq(customers.customerId, id));

    const query = await this.db.select().from(customers).where(eq(customers.customerId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { customerId, responseQuery };
  };
}
