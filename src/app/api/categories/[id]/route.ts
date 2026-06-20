import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);
    const { name, sortOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    await db.update(categories)
      .set({
        name,
        sortOrder: sortOrder || 0,
      })
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id);

    // Check if any products are using this category
    const productsUsingCategory = await db.select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .limit(1);

    if (productsUsingCategory.length > 0) {
      return NextResponse.json(
        { error: "Kategori ini tidak bisa dihapus karena masih ada barang yang menggunakannya." },
        { status: 400 }
      );
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to delete category" }, { status: 500 });
  }
}
