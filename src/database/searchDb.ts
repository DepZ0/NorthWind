import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { customers, products } from "../schema";
import { or, ilike } from "drizzle-orm";

export class SearchDb {
  constructor(private db: NodePgDatabase) {}
  public getAllProductSearchResult = async (productNameForSearch: string, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const searchProducts = await this.db
      .select()
      .from(products)
      .where(ilike(products.productName, `%${productNameForSearch}%`))
      .limit(pageSize)
      .offset(offset);
    return searchProducts;
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
    return searchProducts;
  };
}
