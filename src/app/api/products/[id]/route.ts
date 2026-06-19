import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await req.json();
    const { name, categoryId, unit, stock, priceSell, priceBuy, lowStockThreshold, imageUrl } = body;

    if (!name || !unit || priceSell === undefined) {
      return NextResponse.json({ error: "Nama, satuan, dan harga jual wajib diisi" }, { status: 400 });
    }

    await db.update(products)
      .set({
        name,
        categoryId: categoryId || null,
        unit,
        stock: stock ?? 0,
        priceSell,
        priceBuy: priceBuy || null,
        imageUrl: imageUrl || null,
        lowStockThreshold: lowStockThreshold || 5,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    await db.update(products)
      .set({ isActive: false })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to delete product" }, { status: 500 });
  }
}
