import { SearchDb } from "../../database/searchDb";

export class SearchService {
  constructor(private searchDb: SearchDb) {}

  public getAllProductSearchResult = async (productNameForSearch: string, page: number) => {
    const pageSize = 50;
    const allProductsSearchResult = await this.searchDb.getAllProductSearchResult(productNameForSearch, page, pageSize);
    return allProductsSearchResult;
  };

  public getAllCustomersSearchResult = async (customersForSearch: string, page: number) => {
    const pageSize = 50;
    const allCustomersSearchResult = await this.searchDb.getAllCustomersSearchResult(
      customersForSearch,
      page,
      pageSize
    );
    return allCustomersSearchResult;
  };
}
