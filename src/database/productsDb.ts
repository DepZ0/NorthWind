import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { products } from "../schema";
import { eq } from "drizzle-orm";

export class ProductsDb {
  constructor(private db: NodePgDatabase) {}
  public getAllProducts = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const products_db = await this.db.select().from(products).limit(pageSize).offset(offset);
    return products_db;
  };

  public getProductById = async (id: number) => {
    const productId = await this.db.select().from(products).where(eq(products.productId, id));
    return productId;
  };
}
