import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { products } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

export class ProductsDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public getAllProducts = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const productsDb = await this.db.select().from(products).limit(pageSize).offset(offset);

    const query = await this.db.select().from(products).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(products);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { productsDb: productsDb, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getProductById = async (id: number) => {
    const productId = await this.db.select().from(products).where(eq(products.productId, id));

    const query = await this.db.select().from(products).where(eq(products.productId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { productId, responseQuery };
  };
}
