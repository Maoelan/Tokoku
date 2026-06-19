import { pgTable, serial, text, integer, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  pin: varchar("pin", { length: 50 }).notNull().default("123456"),
  role: varchar("role", { length: 50 }).notNull(), // 'admin' | 'operator'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  unit: varchar("unit", { length: 20 }).notNull(),
  stock: integer("stock").notNull().default(0),
  priceSell: integer("price_sell").notNull(),
  priceBuy: integer("price_buy"),
  imageUrl: varchar("image_url", { length: 500 }),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  showOnLanding: boolean("show_on_landing").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  totalAmount: integer("total_amount").notNull(),
  totalItems: integer("total_items").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").references(() => sales.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtSale: integer("price_at_sale").notNull(),
  subtotal: integer("subtotal").notNull(),
});

export const stockEntries = pgTable("stock_entries", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: text("user_id").references(() => users.id),
  quantity: integer("quantity").notNull(),
  priceBuy: integer("price_buy"),
  supplier: varchar("supplier", { length: 200 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
