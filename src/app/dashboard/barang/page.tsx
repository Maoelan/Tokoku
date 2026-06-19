"use client";

import { useState, useEffect } from "react";
import styles from "./barang.module.css";

type Product = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  stock: number;
  priceSell: number;
  priceBuy: number | null;
  imageUrl: string | null;
  lowStockThreshold: number;
  isActive: boolean;
};

type Category = {
  id: number;
  name: string;
};

type FormData = {
  name: string;
  categoryId: number | "";
  unit: string;
  stock: number | "";
  priceSell: number | "";
  priceBuy: number | "";
  lowStockThreshold: number | "";
  imageUrl: string;
};

const emptyForm: FormData = {
  name: "",
  categoryId: "",
  unit: "pcs",
  stock: "",
  priceSell: "",
  priceBuy: "",
  lowStockThreshold: 5,
  imageUrl: "",
};

export default function DaftarBarang() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      setProducts(await productsRes.json());
      setCategories(await categoriesRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategoryId === "all" || p.categoryId === activeCategoryId;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId || "",
      unit: product.unit,
      stock: product.stock,
      priceSell: product.priceSell,
      priceBuy: product.priceBuy ?? "",
      lowStockThreshold: product.lowStockThreshold,
      imageUrl: product.imageUrl || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setForm({ ...form, imageUrl: data.imageUrl });
      } else {
        alert("Gagal upload gambar: " + data.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat upload gambar.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.unit || !form.priceSell) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        categoryId: form.categoryId || null,
        unit: form.unit,
        stock: Number(form.stock) || 0,
        priceSell: Number(form.priceSell),
        priceBuy: form.priceBuy ? Number(form.priceBuy) : null,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        imageUrl: form.imageUrl || null,
      };

      let res: Response;

      if (editingProduct) {
        // Update existing
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (result.success) {
        alert(editingProduct ? "✅ Barang berhasil diupdate!" : "✅ Barang baru berhasil ditambahkan!");
        closeModal();
        await fetchData();
      } else {
        alert("❌ Gagal: " + (result.error || "Unknown error"));
      }
    } catch {
      alert("❌ Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>📦</span> Daftar Barang</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
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
        
        <select 
          className={styles.searchBox} 
          style={{ width: "auto", minWidth: "150px" }}
          value={activeCategoryId}
          onChange={(e) => setActiveCategoryId(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">Semua Kategori</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          Memuat data barang...
        </div>
      ) : (
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
                else if (product.stock <= product.lowStockThreshold)
                  stockClass = styles.stockLow;

                return (
                  <tr key={product.id} className={styles.tr}>
                    <td className={styles.td} data-label="Nama Barang">
                      <div className={styles.productName}>{product.name}</div>
                    </td>
                    <td className={styles.td} data-label="Kategori">
                      {product.categoryName || "—"}
                    </td>
                    <td className={styles.td} data-label="Harga Jual">
                      {formatRupiah(product.priceSell)}
                    </td>
                    <td className={styles.td} data-label="Stok">
                      <span className={`${styles.stockBadge} ${stockClass}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className={styles.td} data-label="Aksi">
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={styles.actionBtn} onClick={() => openEditModal(product)}>
                          Edit
                        </button>
                        <button 
                          className={styles.actionBtn} 
                          style={{ backgroundColor: "var(--danger)", borderColor: "var(--danger)" }}
                          onClick={async () => {
                            if (confirm(`Apakah Anda yakin ingin menghapus ${product.name}?`)) {
                              try {
                                const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
                                const data = await res.json();
                                if (data.success) {
                                  alert("Barang berhasil dihapus!");
                                  fetchData();
                                } else {
                                  alert("Gagal menghapus: " + data.error);
                                }
                              } catch (e) {
                                alert("Terjadi kesalahan sistem");
                              }
                            }
                          }}
                        >
                          Hapus
                        </button>
                      </div>
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
      )}

      {/* Modal Tambah / Edit Barang */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingProduct ? "✏️ Edit Barang" : "➕ Tambah Barang Baru"}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Barang *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Indomie Goreng"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Kategori</label>
                  <select
                    className={styles.formInput}
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) || "" })}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Satuan *</label>
                  <select
                    className={styles.formInput}
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    required
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="botol">botol</option>
                    <option value="karung">karung</option>
                    <option value="tabung">tabung</option>
                    <option value="rak">rak</option>
                    <option value="bungkus">bungkus</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.priceSell}
                    onChange={(e) => setForm({ ...form, priceSell: Number(e.target.value) || "" })}
                    placeholder="Contoh: 3000"
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Harga Beli (Rp)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.priceBuy}
                    onChange={(e) => setForm({ ...form, priceBuy: Number(e.target.value) || "" })}
                    placeholder="Opsional"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Stok Awal</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) || "" })}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Batas Stok Rendah</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) || "" })}
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Foto Barang (Opsional)</label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  {form.imageUrl && (
                    <img 
                      src={form.imageUrl} 
                      alt="Preview" 
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.formInput}
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ padding: "0.5rem" }}
                    />
                    {uploadingImage && (
                      <small style={{ color: "var(--primary)", marginTop: "0.25rem", display: "block" }}>
                        Sedang mengupload gambar...
                      </small>
                    )}
                    <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>
                      Upload foto barang dari komputer/HP Anda.
                    </small>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className={styles.submitFormBtn} disabled={saving}>
                  {saving ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah Barang"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
