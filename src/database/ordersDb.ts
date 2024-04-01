import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orders } from "../schema";
import { eq, sql } from "drizzle-orm";

export class OrdersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllOrders = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const startDate = new Date().getTime();
    const orders_db = await this.db.select().from(orders).limit(pageSize).offset(offset);
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(orders);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const ordersQuery = this.db.select().from(orders).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: ordersQuery, timestamp, duration };
    return { orders_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getOrderById = async (id: number) => {
    const startDate = new Date().getTime();
    const orderId = await this.db.select().from(orders).where(eq(orders.orderId, id));
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const orderIdQuery = await this.db.select().from(orders).where(eq(orders.orderId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: orderIdQuery, timestamp, duration };

    return { orderId, responseQuery };
  };
}
