import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { orderdetails, orders, products } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";
import { getExecutionTime } from "../util/query";

export class OrdersDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}

  public getAllOrders = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const ordersDb = await this.db.select().from(orders).limit(pageSize).offset(offset);
    const databaseResult = await Promise.all(
      ordersDb.map(async (order) => {
        const orderDetailsDb = await this.db
          .select()
          .from(orderdetails)
          .where(eq(orderdetails.orderId, Number(order.orderId)));

        const totalPrice = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.unitPrice) * Number(item.quantity) * (1 - Number(item.discount));
        }, 0);

        const totalQuantity = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.quantity);
        }, 0);

        const totalProducts = orderDetailsDb.length;

        const totalDiscount = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.discount);
        }, 0);

        return {
          ...order,
          customerId: undefined,
          employeeId: undefined,
          orderData: undefined,
          requiredDate: undefined,
          shipVia: undefined,
          freight: undefined,
          shipAddress: undefined,
          shipRegion: undefined,
          shipPostalCode: undefined,
          orderDetails: {
            totalPrice: totalPrice,
            totalQuantity: totalQuantity,
            totalProducts: totalProducts,
            totalDiscount: totalDiscount,
          },
        };
      })
    );

    const query = await this.db.select().from(orders).limit(pageSize).offset(offset).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(orders);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };
    return { ordersDb: databaseResult, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getOrderById = async (id: number) => {
    const orderId = await this.db.select().from(orders).where(eq(orders.orderId, id));
    const databaseResult = await Promise.all(
      orderId.map(async (orders) => {
        const orderDetailsDb = await this.db
          .select()
          .from(orderdetails)
          .where(eq(orderdetails.orderId, Number(orders.orderId)));

        const totalPrice = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.unitPrice) * Number(item.quantity) * (1 - Number(item.discount));
        }, 0);

        const totalQuantity = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.quantity);
        }, 0);

        const totalProducts = orderDetailsDb.length;

        const totalDiscount = orderDetailsDb.reduce((total, item) => {
          return total + Number(item.discount);
        }, 0);

        const productsInfo = await Promise.all(
          orderDetailsDb.map(async (detail) => {
            const product = await this.db
              .select()
              .from(products)
              .where(eq(products.productId, Number(detail.productId)));

            const totalPrice = Number(detail.unitPrice) * Number(detail.quantity);

            return { ...product[0], ...detail, totalPrice: totalPrice };
          })
        );

        return {
          ...orders,
          orderDetails: {
            totalPrice: totalPrice,
            totalQuantity: totalQuantity,
            totalProducts: totalProducts,
            totalDiscount: totalDiscount,
          },
          products: productsInfo,
        };
      })
    );

    const query = this.db.select().from(orders).where(eq(orders.orderId, id)).toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = getExecutionTime(res);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { databaseResult, responseQuery };
  };
}
