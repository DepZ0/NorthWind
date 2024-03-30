import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { supplies } from "../schema";
import { eq } from "drizzle-orm";

export class SuppliersDb {
  constructor(private db: NodePgDatabase) {}
  public getAllSuppliers = async (page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const suppliers = await this.db.select().from(supplies).limit(pageSize).offset(offset);
    return suppliers;
  };

  public getSupllierById = async (id: number) => {
    const suplierId = await this.db.select().from(supplies).where(eq(supplies.supplierId, id));
    return suplierId;
  };
}
