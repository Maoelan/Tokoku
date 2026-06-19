import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items, notes } = body;

    if (!userId || !items || !items.length) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    let totalAmount = 0;
    let totalItems = 0;
    
    for (const item of items) {
      totalAmount += item.quantity * item.price;
      totalItems += item.quantity;
    }

    const newSaleId = await db.transaction(async (tx) => {
      // 1. Create sale record
      const [newSale] = await tx.insert(sales).values({
        userId,
        totalAmount,
        totalItems,
        notes: notes || "",
      }).returning({ id: sales.id });

      // 2. Create sale items and deduct stock
      for (const item of items) {
        await tx.insert(saleItems).values({
          saleId: newSale.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: item.price,
          subtotal: item.quantity * item.price,
        });

        await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return newSale.id;
    });

    return NextResponse.json({ success: true, saleId: newSaleId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Transaction failed" }, { status: 500 });
  }
}
