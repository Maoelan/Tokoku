import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, sortOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama kategori wajib diisi" }, { status: 400 });
    }

    const [newCategory] = await db.insert(categories).values({
      name,
      sortOrder: sortOrder || 0,
    }).returning({ id: categories.id });

    return NextResponse.json({ success: true, id: newCategory.id });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to create category" }, { status: 500 });
  }
}
