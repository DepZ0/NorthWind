import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers } from "../schema";
import { eq, sql } from "drizzle-orm";
import { Pool } from "pg";

// no need to init pool here. You already have it in index.ts. Just pass it to CustoersDb like you did with "db"
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class CustomersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllCustomers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    // use camelCase "customersDb". You can call it just "customers"
    // add order by (described in searchDb why you need it)
    const customers_db = await this.db.select().from(customers).limit(pageSize).offset(offset);

    const query = await this.db.select().from(customers).limit(pageSize).offset(offset).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[3]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(customers);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    /**
     *  you already have this value on 15 line.
     *  check it everywhere
     */
    const customersQuery = this.db.select().from(customers).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: customersQuery, timestamp, duration };

    return { customers_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getCustomerById = async (id: string) => {
    const customerId = await this.db.select().from(customers).where(eq(customers.customerId, id));

    const query = await this.db.select().from(customers).where(eq(customers.customerId, id)).toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[4]["QUERY PLAN"].replace("Execution Time: ", "");

    const customerIdQuery = await this.db.select().from(customers).where(eq(customers.customerId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: customerIdQuery, timestamp, duration };

    return { customerId, responseQuery };
  };
}
