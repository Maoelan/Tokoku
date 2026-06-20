import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, users, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Get all sales with user info
    const salesData = await db
      .select({
        id: sales.id,
        totalAmount: sales.totalAmount,
        totalItems: sales.totalItems,
        notes: sales.notes,
        createdAt: sales.createdAt,
        userName: users.name,
        userId: sales.userId,
      })
      .from(sales)
      .leftJoin(users, eq(sales.userId, users.id))
      .orderBy(desc(sales.createdAt));

    // For each sale, get items with product name
    const result = await Promise.all(
      salesData.map(async (sale) => {
        const items = await db
          .select({
            id: saleItems.id,
            saleId: saleItems.saleId,
            productId: saleItems.productId,
            quantity: saleItems.quantity,
            priceAtSale: saleItems.priceAtSale,
            subtotal: saleItems.subtotal,
            productName: products.name,
          })
          .from(saleItems)
          .leftJoin(products, eq(saleItems.productId, products.id))
          .where(eq(saleItems.saleId, sale.id));

        return {
          ...sale,
          items,
        };
      })
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sales history" }, { status: 500 });
  }
}
