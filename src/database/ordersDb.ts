import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orders } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

export class OrdersDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}

  public getAllOrders = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const ordersDb = await this.db.select().from(orders).limit(pageSize).offset(offset);

    const query = await this.db.select().from(orders).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(orders);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };
    return { ordersDb: ordersDb, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getOrderById = async (id: number) => {
    const orderId = await this.db.select().from(orders).where(eq(orders.orderId, id));

    const query = await this.db.select().from(orders).where(eq(orders.orderId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { orderId, responseQuery };
  };
}
