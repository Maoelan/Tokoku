"use client";

import { useState, useEffect } from "react";
import styles from "./restok.module.css";

type Product = {
  id: number;
  name: string;
  unit: string;
  stock: number;
};

export default function InputBarangMasuk() {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [supplier, setSupplier] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;

    const storedUser = localStorage.getItem("tokoku_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    setSaving(true);
    try {
      const res = await fetch("/api/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          userId: user?.id || null,
          quantity: Number(quantity),
          supplier,
          notes: "",
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert(`✅ Berhasil menambahkan ${quantity} stok untuk ${selectedProduct?.name}!`);
        setSelectedProductId("");
        setQuantity("");
        setSupplier("");
        // Refresh products to get updated stock
        const updatedProducts = await fetch("/api/products");
        setProducts(await updatedProducts.json());
      } else {
        alert("❌ Gagal menyimpan: " + (result.error || "Unknown error"));
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>📥</span> Input Barang Masuk</h1>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSimpan}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Pilih Barang</label>
            <select
              className={styles.select}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value) || "")}
              required
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Memuat barang..." : "-- Cari dan Pilih Barang --"}
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className={styles.productInfo}>
              <div className={styles.productName}>{selectedProduct.name}</div>
              <div className={styles.productStock}>
                Stok saat ini: <strong>{selectedProduct.stock} {selectedProduct.unit}</strong>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Jumlah Masuk</label>
            <input
              type="number"
              className={styles.input}
              placeholder="Contoh: 50"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || "")}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Nama Supplier (Opsional)</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Contoh: Agen Makmur"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!selectedProductId || !quantity || saving}
          >
            {saving ? "Menyimpan..." : "Simpan Barang Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
