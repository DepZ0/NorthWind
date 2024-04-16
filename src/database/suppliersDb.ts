import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { supplies } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";
import { getExecutionTime } from "../util/query";

export class SuppliersDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public getAllSuppliers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const suppliesDb = await this.db.select().from(supplies).limit(pageSize).offset(offset);

    const query = this.db.select().from(supplies).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(supplies);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };
    return { suppliesDb: suppliesDb, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getSupllierById = async (id: number) => {
    const suplierId = await this.db.select().from(supplies).where(eq(supplies.supplierId, id));

    const query = this.db.select().from(supplies).where(eq(supplies.supplierId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { suplierId, responseQuery };
  };
}
