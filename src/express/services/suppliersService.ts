import { SuppliersDb } from "../../database/suppliersDB";

export class SuppliersService {
  constructor(private suppliersDb: SuppliersDb) {}
  public getAllSuppliers = async (page: number) => {
    const pageSize = 20;
    const allSuppliers = await this.suppliersDb.getAllSuppliers(page, pageSize);
    return allSuppliers;
  };

  public getSuplierById = async (id: number) => {
    const suplierId = await this.suppliersDb.getSupllierById(id);
    return suplierId;
  };
}
