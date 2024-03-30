import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orders } from "../schema";
import { eq } from "drizzle-orm";

export class OrdersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllOrders = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const orders_db = await this.db.select().from(orders).limit(pageSize).offset(offset);
    return orders_db;
  };

  public getOrderById = async (id: number) => {
    const orderId = await this.db.select().from(orders).where(eq(orders.orderId, id));
    return orderId;
  };
}
