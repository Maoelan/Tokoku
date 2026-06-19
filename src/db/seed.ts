import { db } from "./index";
import { users, categories, products, sales, saleItems } from "./schema";
import { mockUsers, categories as mockCategories, products as mockProducts, mockSales } from "../lib/data";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("Seeding database...");
  
  try {
    // Insert users
    console.log("Inserting users...");
    await db.insert(users).values(
      mockUsers.map(u => ({
        id: u.id,
        name: u.name,
        role: u.role,
      }))
    ).onConflictDoNothing();

    // Insert categories
    console.log("Inserting categories...");
    await db.insert(categories).values(
      mockCategories.map(c => ({
        id: c.id,
        name: c.name,
      }))
    ).onConflictDoNothing();

    // Insert products
    console.log("Inserting products...");
    await db.insert(products).values(
      mockProducts.map(p => ({
        id: p.id,
        name: p.name,
        categoryId: p.category_id,
        unit: p.unit,
        stock: p.stock,
        priceSell: p.price_sell,
        priceBuy: p.price_buy || null,
        imageUrl: p.image_url || null,
        lowStockThreshold: p.low_stock_threshold,
      }))
    ).onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
