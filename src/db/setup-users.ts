import { db } from "./index";
import { users } from "./schema";

async function main() {
  try {
    console.log("Menghapus user lama...");
    await db.delete(users);

    console.log("Membuat user baru: Mamah, Bapak, Admin...");
    await db.insert(users).values([
      { id: "1", name: "Admin (Aku)", email: "admin@tokoku.com", role: "admin", pin: "123456" },
      { id: "2", name: "Mamah", email: "mamah@tokoku.com", role: "operator", pin: "111111" },
      { id: "3", name: "Bapak", email: "bapak@tokoku.com", role: "operator", pin: "222222" },
    ]);

    console.log("✅ User berhasil dibuat dengan PIN!");
    process.exit(0);
  } catch (error) {
    console.error("Gagal setup user:", error);
    process.exit(1);
  }
}

main();
