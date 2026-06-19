import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create safe filename
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    
    // Define the path to save the file
    // Note: In production on Vercel, this local folder is read-only.
    // For production, you should use Supabase Storage.
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    // Save file
    await fs.writeFile(filePath, buffer);

    // Return the URL that can be used to access the image
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengupload gambar" },
      { status: 500 }
    );
  }
}
