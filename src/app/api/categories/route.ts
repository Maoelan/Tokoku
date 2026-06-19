import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
