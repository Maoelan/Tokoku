import { NextResponse } from "next/server";
import { db } from "@/db";
import { stockEntries, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, userId, quantity, supplier, notes } = body;

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      await tx.insert(stockEntries).values({
        productId,
        userId: userId || null,
        quantity,
        supplier: supplier || "",
        notes: notes || "",
      });

      await tx.update(products)
        .set({ stock: sql`${products.stock} + ${quantity}` })
        .where(eq(products.id, productId));
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Transaction failed" }, { status: 500 });
  }
}
