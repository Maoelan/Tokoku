"use client";

import { useState, useEffect } from "react";
import styles from "../barang/barang.module.css"; // Reuse styling from barang

type Category = {
  id: number;
  name: string;
  sortOrder: number;
};

export default function KategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    sortOrder: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      // Sort by sortOrder
      if (Array.isArray(data)) {
        data.sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ name: "", sortOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", sortOrder: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/categories/${formData.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan kategori");
        return;
      }

      closeModal();
      fetchData();
    } catch (error) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"?`)) {
      try {
        const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          alert("Kategori berhasil dihapus!");
          fetchData();
        } else {
          alert("Gagal menghapus: " + data.error);
        }
      } catch (e) {
        alert("Terjadi kesalahan sistem");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🏷️ Manajemen Kategori</h1>
        <button className={styles.addBtn} onClick={() => openModal()}>
          + Tambah Kategori
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>No</th>
              <th className={styles.th}>Nama Kategori</th>
              <th className={styles.th}>Urutan</th>
              <th className={styles.th}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.td} style={{ textAlign: "center" }}>
                  Memuat data...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.td} style={{ textAlign: "center" }}>
                  Belum ada kategori.
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr key={cat.id} className={styles.tr}>
                  <td className={styles.td} data-label="No">{index + 1}</td>
                  <td className={styles.td} data-label="Kategori">
                    <span className={styles.productName}>{cat.name}</span>
                  </td>
                  <td className={styles.td} data-label="Urutan">
                    {cat.sortOrder}
                  </td>
                  <td className={styles.td} data-label="Aksi">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className={styles.actionBtn} onClick={() => openModal(cat)}>
                        Edit
                      </button>
                      <button 
                        className={styles.actionBtn} 
                        style={{ backgroundColor: "var(--danger)", borderColor: "var(--danger)", color: "white" }}
                        onClick={() => handleDelete(cat)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {formData.id ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h2>
              <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Kategori</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Misal: Rokok"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Urutan Tampil (Sort Order)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal} disabled={isSubmitting}>
                  Batal
                </button>
                <button type="submit" className={styles.submitFormBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
