import { CustomersDb } from "../../database/customersDb";

export class CustomersService {
  constructor(private customersDb: CustomersDb) {}
  public getAllCustomers = async (page: number) => {
    const pageSize = 20;
    const allCustomers = await this.customersDb.getAllCustomers(page, pageSize);
    return allCustomers;
  };

  public getCustomerById = async (id: string) => {
    const customerId = await this.customersDb.getCustomerById(id);
    return customerId;
  };
}
