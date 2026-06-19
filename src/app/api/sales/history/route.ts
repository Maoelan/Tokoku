import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: sales.id,
        totalAmount: sales.totalAmount,
        totalItems: sales.totalItems,
        createdAt: sales.createdAt,
        userName: users.name,
      })
      .from(sales)
      .leftJoin(users, eq(sales.userId, users.id))
      .orderBy(desc(sales.createdAt));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}
