import { db } from "./index";
import { products, categories, sales, saleItems, stockEntries } from "./schema";

async function main() {
  console.log("Menghapus data dummy/demo dari database...");

  try {
    // Hapus dengan urutan dari child ke parent untuk menghindari error Foreign Key
    console.log("- Menghapus sale_items...");
    await db.delete(saleItems);

    console.log("- Menghapus sales...");
    await db.delete(sales);

    console.log("- Menghapus stock_entries...");
    await db.delete(stockEntries);

    console.log("- Menghapus products...");
    await db.delete(products);

    console.log("- Menghapus categories...");
    await db.delete(categories);

    console.log("✅ Semua data dummy berhasil dihapus!");
    console.log("User Admin tetap dipertahankan agar Anda bisa login.");
    process.exit(0);
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    process.exit(1);
  }
}

main();
