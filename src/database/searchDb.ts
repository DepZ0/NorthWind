import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers, products } from "../schema";
import { or, ilike } from "drizzle-orm";
import { Pool } from "pg";
import { getExecutionTime } from "../util/query";

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

    const databaseResult = searchProducts.map((serachResult) => {
      return {
        ...serachResult,
        supplierId: undefined,
        categoryId: undefined,
        unitsOnOrder: undefined,
        reorderLevel: undefined,
        discontinued: undefined,
      };
    });

    const query = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset)
      .toSQL();
    const res = await this.pool.query(`EXPLAIN ANALYZE ${query.sql}`, query.params);

    const duration = getExecutionTime(res);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { databaseResult, responseQuery };
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

    const databaseResult = searchCustomers.map((searchResult) => {
      return {
        ...searchResult,
        address: undefined,
        city: undefined,
        region: undefined,
        postalCode: undefined,
        country: undefined,
        fax: undefined,
      };
    });

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

    const duration = getExecutionTime(res);

    const timestamp = new Date().getTime();
    const responseQuery = { query: query.sql, timestamp, duration };

    return { databaseResult, responseQuery };
  };
}
