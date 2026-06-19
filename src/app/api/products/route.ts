import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: products.id,
        name: products.name,
        categoryId: products.categoryId,
        categoryName: categories.name,
        unit: products.unit,
        stock: products.stock,
        priceSell: products.priceSell,
        priceBuy: products.priceBuy,
        imageUrl: products.imageUrl,
        lowStockThreshold: products.lowStockThreshold,
        showOnLanding: products.showOnLanding,
        isActive: products.isActive,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));
      
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
