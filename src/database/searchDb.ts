import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers, products } from "../schema";
import { or, ilike } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export class SearchDb {
  constructor(private db: NodePgDatabase) {}
  public getAllProductSearchResult = async (productNameForSearch: string, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    /**
     * You should add order by
     * Sometimes this query can return values in different order
     *
     * Like this:
     * 1. product1       1. product2
     * 2. product2       2. product1
     * 3. product3       3. product4
     * 4. product4       4. product3
     * 5. product5       5. product5
     *
     * If you will add order by - it will always return same order and you can add pagination to it
     */

    const searchProducts = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset);

    const query = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset)
      .toSQL();
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[5]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset)
      .toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: result, timestamp, duration };

    return { searchProducts, responseQuery };
  };

  public getAllCustomersSearchResult = async (customersSearchParams: string, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const searchProducts = await this.db
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
      .offset(offset);

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
    const res = await pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);
    const duration = res.rows[5]["QUERY PLAN"].replace("Execution Time: ", "");

    const result = await this.db
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
      .toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: result, timestamp, duration };

    return { searchProducts, responseQuery };
  };
}
