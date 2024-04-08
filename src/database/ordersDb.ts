import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orders } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class OrdersDb {
  constructor(private db: NodePgDatabase) {}

  public getAllOrders = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const orders_db = await this.db.select().from(orders).limit(pageSize).offset(offset);

    const query = await this.db.select().from(orders).limit(pageSize).offset(offset).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(orders);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const ordersQuery = this.db.select().from(orders).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: ordersQuery, timestamp, duration };
    return { orders_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getOrderById = async (id: number) => {
    const orderId = await this.db.select().from(orders).where(eq(orders.orderId, id));

    const query = await this.db.select().from(orders).where(eq(orders.orderId, id)).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const orderIdQuery = await this.db.select().from(orders).where(eq(orders.orderId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: orderIdQuery, timestamp, duration };

    return { orderId, responseQuery };
  };
}
