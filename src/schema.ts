import { pgTable, integer, varchar, real } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable("categories", {
  categoryId: integer("CategoryID"), //in sql you should use customer_id format. Use serial here and it should be primary key (read about it)
  categoryName: varchar("CategoryName", { length: 50 }),
  description: varchar("Description", { length: 50 }),
});

export const customers = pgTable("customers", {
  customerId: varchar("CustomerID", { length: 50 }), // serial, primary key
  companyName: varchar("CompanyName", { length: 50 }),
  contactName: varchar("ContactName", { length: 50 }),
  contactTitle: varchar("ContactTitle", { length: 50 }),
  address: varchar("Address", { length: 50 }),
  city: varchar("City", { length: 50 }),
  region: varchar("Region", { length: 50 }),
  postalCode: varchar("PostalCode", { length: 50 }),
  country: varchar("Country", { length: 50 }),
  phone: varchar("Phone", { length: 50 }),
  fax: varchar("Fax", { length: 50 }),
});

export const employees = pgTable("employees", {
  employeeId: varchar("EmployeeID", { length: 50 }), // serial, primary key
  lastName: varchar("LastName", { length: 50 }),
  firstName: varchar("FirstName", { length: 50 }),
  title: varchar("Title", { length: 50 }),
  titleOfCourtesy: varchar("TitleOfCourtesy", { length: 50 }),
  birthDate: varchar("BirthDate", { length: 50 }),
  hireDate: varchar("HireDate", { length: 50 }),
  address: varchar("Address", { length: 256 }),
  city: varchar("City", { length: 128 }),
  region: varchar("Region", { length: 64 }),
  postalCode: varchar("PostalCode", { length: 50 }),
  country: varchar("Country", { length: 64 }),
  homePhone: varchar("HomePhone", { length: 50 }),
  extension: varchar("Extension", { length: 50 }),
  notes: varchar("Notes", { length: 256 }),
  reportsTo: varchar("ReportsTo", { length: 256 }),
});

export const employeeterritories = pgTable("employeeterritories", {
  employeeId: integer("EmployeeID"),
  territoryId: integer("TerritoryID"),
});

export const orderdetails = pgTable("orderdetails", {
  orderId: integer("OrderID"),
  productId: integer("ProductID"),
  unitPrice: integer("UnitPrice"),
  quantity: integer("Quantity"),
  discount: integer("Discount"),
});

export const orders = pgTable("orders", {
  orderId: integer("OrderID"),
  customerId: varchar("CustomerID", { length: 50 }),
  employeeId: integer("EmployeeID"),
  orderDate: varchar("OrderDate", { length: 50 }),
  requiredDate: varchar("RequiredDate", { length: 50 }),
  shippedDate: varchar("ShippedDate", { length: 50 }),
  shipVia: integer("ShipVia"),
  freight: real("Freight"),
  shipName: varchar("ShipName", { length: 50 }),
  shipAddress: varchar("ShipAddress", { length: 50 }),
  shipCity: varchar("ShipCity", { length: 50 }),
  shipRegion: varchar("ShipRegion", { length: 50 }),
  shipPostalCode: varchar("ShipPostalCode", { length: 50 }),
  shipCountry: varchar("ShipCountry", { length: 50 }),
});

export const products = pgTable("products", {
  productId: integer("ProductID"),
  productName: varchar("ProductName", { length: 50 }),
  supplierId: integer("SupplierID"),
  categoryId: integer("CategoryID"),
  quantityPerUnit: varchar("QuantityPerUnit", { length: 50 }),
  unitPrice: integer("UnitPrice"),
  unitsInStock: integer("UnitsInStock"),
  unitsOnOrder: integer("UnitsOnOrder"),
  reorderLevel: integer("ReorderLevel"),
  discontinued: integer("Discontinued"),
});

export const regions = pgTable("regions", {
  regionId: integer("RegionID"),
  regionDescription: varchar("RegionDescription", { length: 50 }),
});

export const shippers = pgTable("shippers", {
  shipperId: integer("ShipperID"),
  companyName: varchar("CompanyName", { length: 50 }),
  phone: varchar("Phone", { length: 50 }),
});

export const supplies = pgTable("supplies", {
  supplierId: integer("SupplierID"),
  companyName: varchar("CompanyName", { length: 50 }),
  contactName: varchar("ContactName", { length: 50 }),
  contactTitle: varchar("ContactTitle", { length: 50 }),
  address: varchar("Address", { length: 50 }),
  city: varchar("City", { length: 50 }),
  region: varchar("Region", { length: 50 }),
  postalCode: varchar("PostalCode", { length: 50 }),
  country: varchar("Country", { length: 50 }),
  phone: varchar("Phone", { length: 50 }),
  fax: varchar("Fax", { length: 50 }),
  homePage: varchar("HomePage", { length: 128 }),
});

export const territories = pgTable("territories", {
  territoryId: integer("TerritoryID"),
  territoryDescription: varchar("TerritoryDescription", { length: 50 }),
  regionId: integer("RegionID"),
});

export type CustomerModel = typeof customers.$inferSelect;
export type CustomerInsert = typeof customers.$inferInsert;
