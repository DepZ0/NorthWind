import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { CustomerModel, customers } from "../schema";
import { eq, sql } from "drizzle-orm";

export class DashBoardDb {
  constructor(private db: NodePgDatabase) {}
  //   public getAllCustomers = async (page: number, pageSize: number): Promise<CustomerModel[]> => {
  //     const offset = (page - 1) * pageSize;
  //     const customers_db: CustomerModel[] = await this.db.select().from(customers).limit(pageSize).offset(offset);
  //     // const sql1 = this.db.select().from(customers).toSQL();
  //     // console.log(sql1);

  //     return customers_db;
  //   };
}
