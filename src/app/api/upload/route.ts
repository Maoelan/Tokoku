import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
    
    // Upload to Supabase Storage bucket named 'products'
    const { error } = await supabase
      .storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: "Gagal mengupload gambar ke cloud" }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from("products")
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, imageUrl: publicUrlData.publicUrl });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}
