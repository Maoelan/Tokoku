import { db } from "./index";
import { categories } from "./schema";

async function main() {
  try {
    console.log("Membuat kategori dasar...");
    await db.insert(categories).values([
      { name: "Sembako", sortOrder: 1 },
      { name: "Minuman", sortOrder: 2 },
      { name: "Makanan Ringan", sortOrder: 3 },
      { name: "Bumbu Dapur", sortOrder: 4 },
      { name: "Obat-obatan", sortOrder: 5 },
      { name: "Kebutuhan Mandi & Cuci", sortOrder: 6 },
      { name: "Lain-lain", sortOrder: 7 },
    ]).onConflictDoNothing();

    console.log("✅ Kategori berhasil dibuat!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal setup kategori:", error);
    process.exit(1);
  }
}

main();
