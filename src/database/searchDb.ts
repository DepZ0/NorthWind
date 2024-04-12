import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers, products } from "../schema";
import { or, ilike } from "drizzle-orm";
import { Pool } from "pg";

export class SearchDb {
  constructor(private db: NodePgDatabase, private pool: Pool) {}
  public getAllProductSearchResult = async (productNameForSearch: string, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const searchProducts = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset)
      .orderBy(products.productId);

    const query = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset)
      .toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);

    let duration;
    for (let row of res.rows) {
      if (row["QUERY PLAN"].includes("Execution Time: ")) {
        duration = row["QUERY PLAN"].replace("Execution Time: ", "");
        break;
      }
    }

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { searchProducts, responseQuery };
  };

  public getAllCustomersSearchResult = async (customersSearchParams: string, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const searchCustomers = await this.db
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.companyName, `%${customersSearchParams}%`),
          ilike(customers.contactName, `%${customersSearchParams}%`),
          ilike(customers.contactTitle, `%${customersSearchParams}%`),
          ilike(customers.address, `%${customersSearchParams}%`)
        )
      )
      .limit(pageSize)
      .offset(offset)
      .orderBy(customers.customerId);

    const query = await this.db
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.companyName, `%${customersSearchParams}%`),
          ilike(customers.contactName, `%${customersSearchParams}%`),
          ilike(customers.contactTitle, `%${customersSearchParams}%`),
          ilike(customers.address, `%${customersSearchParams}%`)
        )
      )
      .limit(pageSize)
      .offset(offset)
      .toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);

    let duration;
    for (let row of res.rows) {
      if (row["QUERY PLAN"].includes("Execution Time: ")) {
        duration = row["QUERY PLAN"].replace("Execution Time: ", "");
        break;
      }
    }

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { searchCustomers, responseQuery };
  };
}
