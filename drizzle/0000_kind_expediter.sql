CREATE TABLE IF NOT EXISTS "categories" (
	"CategoryID" integer PRIMARY KEY NOT NULL,
	"CategoryName" varchar(50),
	"Description" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"CustomerID" integer PRIMARY KEY NOT NULL,
	"CompanyName" varchar(50),
	"ContactName" varchar(50),
	"ContactTitle" varchar(50),
	"Address" varchar(50),
	"City" varchar(50),
	"Region" varchar(50),
	"PostalCode" varchar(50),
	"Country" varchar(50),
	"Phone" varchar(50),
	"Fax" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"EmployeeID" integer PRIMARY KEY NOT NULL,
	"LastName" varchar(50),
	"FirstName" varchar(50),
	"Title" varchar(50),
	"TitleOfCourtesy" varchar(50),
	"BirthDate" varchar(50),
	"HireDate" varchar(50),
	"Address" varchar(256),
	"City" varchar(128),
	"Region" varchar(64),
	"PostalCode" varchar(50),
	"Country" varchar(64),
	"HomePhone" varchar(50),
	"Extension" varchar(50),
	"Notes" varchar(256),
	"ReportsTo" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employeeterritories" (
	"EmployeeID" integer,
	"TerritoryID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderdetails" (
	"OrderID" integer PRIMARY KEY NOT NULL,
	"ProductID" integer,
	"UnitPrice" integer,
	"Quantity" integer,
	"Discount" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"OrderID" integer PRIMARY KEY NOT NULL,
	"CustomerID" varchar(50),
	"EmployeeID" integer,
	"OrderDate" varchar(50),
	"RequiredDate" varchar(50),
	"ShippedDate" varchar(50),
	"ShipVia" integer,
	"Freight" real,
	"ShipName" varchar(50),
	"ShipAddress" varchar(50),
	"ShipCity" varchar(50),
	"ShipRegion" varchar(50),
	"ShipPostalCode" varchar(50),
	"ShipCountry" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"ProductID" integer PRIMARY KEY NOT NULL,
	"ProductName" varchar(50),
	"SupplierID" integer,
	"CategoryID" integer,
	"QuantityPerUnit" varchar(50),
	"UnitPrice" integer,
	"UnitsInStock" integer,
	"UnitsOnOrder" integer,
	"ReorderLevel" integer,
	"Discontinued" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regions" (
	"RegionID" integer PRIMARY KEY NOT NULL,
	"RegionDescription" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shippers" (
	"ShipperID" integer PRIMARY KEY NOT NULL,
	"CompanyName" varchar(50),
	"Phone" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supplies" (
	"SupplierID" integer PRIMARY KEY NOT NULL,
	"CompanyName" varchar(50),
	"ContactName" varchar(50),
	"ContactTitle" varchar(50),
	"Address" varchar(50),
	"City" varchar(50),
	"Region" varchar(50),
	"PostalCode" varchar(50),
	"Country" varchar(50),
	"Phone" varchar(50),
	"Fax" varchar(50),
	"HomePage" varchar(128)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "territories" (
	"TerritoryID" integer PRIMARY KEY NOT NULL,
	"TerritoryDescription" varchar(50),
	"RegionID" integer PRIMARY KEY NOT NULL
);
