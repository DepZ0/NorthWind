import { OrdersDb } from "../../database/ordersDb";

export class OrdersService {
  constructor(private ordersDb: OrdersDb) {}
  public getAllOrders = async (page: number) => {
    const pageSize = 20;
    const allOrders = await this.ordersDb.getAllOrders(page, pageSize);
    return allOrders;
  };

  public getOrderById = async (id: number) => {
    const orderId = await this.ordersDb.getOrderById(id);
    return orderId;
  };
}
