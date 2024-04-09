import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { App } from "./app";
import "dotenv/config";
import { SuppliersDb } from "./database/suppliersDB";
import { SuppliersService } from "./express/services/suppliersService";
import { SuppliersController } from "./express/controllers/suppliersController";
import { ProductsDb } from "./database/productsDb";
import { ProductsService } from "./express/services/productsService";
import { ProductsController } from "./express/controllers/productsController";
import { OrdersDb } from "./database/ordersDb";
import { OrdersService } from "./express/services/ordersService";
import { OrdersController } from "./express/controllers/ordersController";
import { EmployeesDb } from "./database/employeesDb";
import { EmployeesService } from "./express/services/employeesService";
import { EmployeesController } from "./express/controllers/employeesController";
import { CustomersDb } from "./database/customersDb";
import { CustomersService } from "./express/services/customersSevice";
import { CustomersController } from "./express/controllers/customersController";
import { SearchDb } from "./database/searchDb";
import { SearchService } from "./express/services/searchService";
import { SearchController } from "./express/controllers/searchController";
import { DashBoardDb } from "./database/dashBoardDb";
import { DashBoardService } from "./express/services/dashBoardService";
import { DashBoardController } from "./express/controllers/dashBoardController";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { logger: false });

  await migrate(db, { migrationsFolder: "drizzle" });

  const suppliersDb = new SuppliersDb(db);
  const suppliersService = new SuppliersService(suppliersDb);
  const suppliersController = new SuppliersController(suppliersService);

  const productsDb = new ProductsDb(db);
  const productsService = new ProductsService(productsDb);
  const productsController = new ProductsController(productsService);

  const ordersDb = new OrdersDb(db);
  const ordersService = new OrdersService(ordersDb);
  const ordersController = new OrdersController(ordersService);

  const employeesDb = new EmployeesDb(db);
  const employeesService = new EmployeesService(employeesDb);
  const employeesController = new EmployeesController(employeesService);

  const customersDb = new CustomersDb(db);
  const customersService = new CustomersService(customersDb);
  const customersController = new CustomersController(customersService);

  const searchDb = new SearchDb(db);
  const searchService = new SearchService(searchDb);
  const searchController = new SearchController(searchService);

  const dashBoardDb = new DashBoardDb(db);
  const dashBoardService = new DashBoardService(dashBoardDb);
  const dashBoardController = new DashBoardController(dashBoardService);

  const app = new App(3000, [
    suppliersController,
    productsController,
    ordersController,
    employeesController,
    customersController,
    searchController,
    dashBoardController,
  ]);
  app.start();
}

main();
