"use client";

import { useState } from "react";
import styles from "./restok.module.css";
import { products } from "@/lib/data";

export default function InputBarangMasuk() {
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [supplier, setSupplier] = useState("");

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) return;
    
    alert(`✅ Berhasil menambahkan ${quantity} stok untuk ${selectedProduct?.name}! (Mock Frontend)`);
    
    // Reset form
    setSelectedProductId("");
    setQuantity("");
    setSupplier("");
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
            >
              <option value="" disabled>-- Cari dan Pilih Barang --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className={styles.productInfo}>
              <div className={styles.productName}>{selectedProduct.name}</div>
              <div className={styles.productStock}>Stok saat ini: <strong>{selectedProduct.stock} {selectedProduct.unit}</strong></div>
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
            disabled={!selectedProductId || !quantity}
          >
            Simpan Barang Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
