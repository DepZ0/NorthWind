import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { products } from "../schema";
import { eq, sql } from "drizzle-orm";

export class ProductsDb {
  constructor(private db: NodePgDatabase) {}
  public getAllProducts = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const startDate = new Date().getTime();
    const products_db = await this.db.select().from(products).limit(pageSize).offset(offset);

    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(products);
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const productsQuery = this.db.select().from(products).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: productsQuery, timestamp, duration };

    return { products_db, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getProductById = async (id: number) => {
    const startDate = new Date().getTime();
    const productId = await this.db.select().from(products).where(eq(products.productId, id));
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const productIdQuery = await this.db.select().from(products).where(eq(products.productId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: productIdQuery, timestamp, duration };

    return { productId, responseQuery };
  };
}
