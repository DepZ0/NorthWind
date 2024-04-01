import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CustomerModel, customers } from "../schema";
import { eq, sql } from "drizzle-orm";

export class CustomersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllCustomers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const startDate = new Date().getTime();
    const customers_db = await this.db.select().from(customers).limit(pageSize).offset(offset);
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(customers);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const customersQuery = this.db.select().from(customers).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: customersQuery, timestamp, duration };

    return { customers_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getCustomerById = async (id: string) => {
    const startDate = new Date().getTime();
    const customerId = await this.db.select().from(customers).where(eq(customers.customerId, id));
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const customerIdQuery = await this.db.select().from(customers).where(eq(customers.customerId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: customerIdQuery, timestamp, duration };

    return { customerId, responseQuery };
  };
}
