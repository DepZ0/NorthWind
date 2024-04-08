import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { supplies } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class SuppliersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllSuppliers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const suppliers = await this.db.select().from(supplies).limit(pageSize).offset(offset);

    const query = await this.db.select().from(supplies).limit(pageSize).offset(offset).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(supplies);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const suppliersQuery = this.db.select().from(supplies).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: suppliersQuery, timestamp, duration };
    return { suppliers, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getSupllierById = async (id: number) => {
    const suplierId = await this.db.select().from(supplies).where(eq(supplies.supplierId, id));

    const query = await this.db.select().from(supplies).where(eq(supplies.supplierId, id)).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const supplierIdQuery = await this.db.select().from(supplies).where(eq(supplies.supplierId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: supplierIdQuery, timestamp, duration };

    return { suplierId, responseQuery };
  };
}
