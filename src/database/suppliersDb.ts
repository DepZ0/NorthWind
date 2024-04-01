import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { supplies } from "../schema";
import { eq, sql } from "drizzle-orm";

export class SuppliersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllSuppliers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const startDate = new Date().getTime();
    const suppliers = await this.db.select().from(supplies).limit(pageSize).offset(offset);
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const result = await this.db.select({ count: sql`COUNT(*)` }).from(supplies); // SELECT COUNT(*) FROM supplies
    const count = Number(result[0].count);
    const countOfPages = Math.ceil(count / pageSize);

    const suppliersQuery = this.db.select().from(supplies).limit(pageSize).offset(offset).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: suppliersQuery, timestamp, duration };
    return { suppliers, responseQuery, page: page, pages: countOfPages, total: count };
  };

  public getSupllierById = async (id: number) => {
    const startDate = new Date().getTime();
    const suplierId = await this.db.select().from(supplies).where(eq(supplies.supplierId, id));
    const endDate = new Date().getTime();
    const duration = endDate - startDate;

    const supplierIdQuery = await this.db.select().from(supplies).where(eq(supplies.supplierId, id)).toSQL().sql;

    const timestamp = new Date().getTime();
    const responseQuery = { query: supplierIdQuery, timestamp, duration };

    return { suplierId, responseQuery };
  };
}
