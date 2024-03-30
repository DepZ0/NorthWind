import { ProductsDb } from "../../database/productsDb";

export class ProductsService {
  constructor(private productsDb: ProductsDb) {}
  public getAllProducts = async (page: number) => {
    const pageSize = 20;
    const allProducts = await this.productsDb.getAllProducts(page, pageSize);
    return allProducts;
  };

  public getProductById = async (id: number) => {
    const product = await this.productsDb.getProductById(id);
    return product;
  };
}
