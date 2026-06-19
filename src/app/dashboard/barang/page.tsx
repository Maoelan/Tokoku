"use client";

import { useState } from "react";
import styles from "./barang.module.css";
import { products, categories } from "@/lib/data";

export default function DaftarBarang() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || "Unknown";
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategoryId === "all" || p.category_id === activeCategoryId;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = () => {
    alert("✏️ Fitur Edit akan tersedia setelah backend terhubung.");
  };

  const handleAdd = () => {
    alert("➕ Fitur Tambah Barang akan tersedia setelah backend terhubung.");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>📦</span> Daftar Barang</h1>
        <button className={styles.addBtn} onClick={handleAdd}>
          + Barang Baru
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
        <input
          type="text"
          className={styles.searchBox}
          placeholder="Cari nama barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {/* Simple inline category filter for frontend mockup */}
        <select 
          className={styles.searchBox} 
          style={{ width: "auto", minWidth: "150px" }}
          value={activeCategoryId}
          onChange={(e) => setActiveCategoryId(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">Semua Kategori</option>
          {categories.filter(c => c.id !== 1).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nama Barang</th>
              <th className={styles.th}>Kategori</th>
              <th className={styles.th}>Harga Jual</th>
              <th className={styles.th}>Stok</th>
              <th className={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              let stockClass = styles.stockGood;
              if (product.stock === 0) stockClass = styles.stockEmpty;
              else if (product.stock <= product.low_stock_threshold)
                stockClass = styles.stockLow;

              return (
                <tr key={product.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.productName}>{product.name}</div>
                  </td>
                  <td className={styles.td}>{getCategoryName(product.category_id)}</td>
                  <td className={styles.td}>{formatRupiah(product.price_sell)}</td>
                  <td className={styles.td}>
                    <span className={`${styles.stockBadge} ${stockClass}`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <button className={styles.actionBtn} onClick={handleEdit}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  Tidak ada barang yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
