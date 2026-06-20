import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, products } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ salesToday }] = await db
      .select({ salesToday: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)` })
      .from(sales)
      .where(sql`${sales.createdAt} >= ${today.toISOString()}`);

    const [{ itemsToday }] = await db
      .select({ itemsToday: sql<number>`COALESCE(SUM(${sales.totalItems}), 0)` })
      .from(sales)
      .where(sql`${sales.createdAt} >= ${today.toISOString()}`);

    const [{ lowStockCount }] = await db
      .select({ lowStockCount: sql<number>`COUNT(*)` })
      .from(products)
      .where(sql`${products.stock} <= ${products.lowStockThreshold}`);

    return NextResponse.json({
      salesToday: Number(salesToday),
      itemsToday: Number(itemsToday),
      lowStockCount: Number(lowStockCount),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 });
  }
}
