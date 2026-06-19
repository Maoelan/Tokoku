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
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true));
      
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, categoryId, unit, stock, priceSell, priceBuy, lowStockThreshold, imageUrl } = body;

    if (!name || !unit || priceSell === undefined) {
      return NextResponse.json({ error: "Nama, satuan, dan harga jual wajib diisi" }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      name,
      categoryId: categoryId || null,
      unit,
      stock: stock || 0,
      priceSell,
      priceBuy: priceBuy || null,
      imageUrl: imageUrl || null,
      lowStockThreshold: lowStockThreshold || 5,
    }).returning({ id: products.id });

    return NextResponse.json({ success: true, id: newProduct.id });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to create product" }, { status: 500 });
  }
}

