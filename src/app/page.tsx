"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

type Product = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  unit: string;
  stock: number;
  priceSell: number;
  imageUrl: string | null;
  lowStockThreshold: number;
  showOnLanding: boolean;
  isActive: boolean;
};

type Category = {
  id: number;
  name: string;
  sortOrder: number;
};

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(12);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.showOnLanding || !p.isActive) return false;
    
    // Category filter
    if (activeCategoryId !== "all" && p.categoryId !== activeCategoryId) return false;

    // Search filter
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const displayedProducts = filteredProducts.slice(0, displayLimit);

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStockBadge = (product: Product) => {
    if (product.stock === 0) {
      return (
        <span className={`${styles.badge} ${styles.badgeDanger}`}>
          🔴 Habis
        </span>
      );
    }
    if (product.stock <= product.lowStockThreshold) {
      return (
        <span className={`${styles.badge} ${styles.badgeWarning}`}>
          🟡 Stok Terbatas
        </span>
      );
    }
    return (
      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
        ✅ Tersedia
      </span>
    );
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.logoContainer}>
            <img
              src="/images/logo.png"
              alt="Logo Tokoku Sintung"
              className={styles.mainLogo}
            />
          </div>
          <h1>Tokoku Sintung</h1>
          <p>
            Melayani kebutuhan sehari-hari warga Sintung dan sekitarnya dengan
            harga terbaik.
          </p>

          <div className={styles.heroInfo}>
            <div className={styles.heroInfoItem}>
              <span>📍</span> Sintung, Lombok Tengah
            </div>
            <div className={styles.heroInfoItem}>
              <span>🕐</span> Buka: 10.00 - 20.00
            </div>
          </div>

          <a
            href="https://wa.me/628175786553"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waButton}
          >
            <span>💬</span> Hubungi via WhatsApp
          </a>
        </div>
      </section>

      {/* Catalog Section */}
      <section className={`${styles.catalog} container`}>
        <h2 className={styles.sectionTitle}>📦 Produk Kami</h2>

        {/* Search Bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Cari barang (misal: Surya, Kopi, Gula)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(12); // Reset limit on search
            }}
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "0.875rem 1.25rem",
              borderRadius: "9999px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
              fontSize: "1rem",
              outline: "none",
              boxShadow: "var(--shadow-sm)",
            }}
          />
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${activeCategoryId === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => {
              setActiveCategoryId("all");
              setDisplayLimit(12); // Reset limit on filter change
            }}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeCategoryId === cat.id ? styles.filterBtnActive : ""}`}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setDisplayLimit(12); // Reset limit on filter change
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "2rem" }}>
            Memuat produk...
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className={styles.grid}>
              {displayedProducts.map((product) => (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardImgPlaceholder}>
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    {renderStockBadge(product)}
                    <div className={styles.cardPrice}>
                      {formatRupiah(product.priceSell)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredProducts.length > displayedProducts.length && (
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 12)}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--primary)",
                    color: "var(--primary)",
                    padding: "0.75rem 2rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                >
                  Lihat Lebih Banyak ({filteredProducts.length - displayedProducts.length} lagi) ⬇️
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  marginTop: "2rem",
                  padding: "3rem 1rem",
                  backgroundColor: "var(--surface)",
                  borderRadius: "16px",
                  border: "1px dashed var(--border)",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <h3 style={{ marginBottom: "0.5rem", color: "var(--text-main)" }}>Barang Tidak Ditemukan</h3>
                <p>Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer} style={{ padding: '1.5rem 1rem' }}>
        <div className={`container`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="/images/logo.png"
              alt="Logo Tokoku Sintung"
              className={styles.footerLogo}
              style={{ width: '32px', height: '32px', padding: '0.1rem' }}
            />
            <div style={{ fontWeight: 700, fontSize: "1rem", color: 'var(--text-main)' }}>
              Tokoku Sintung
            </div>
          </div>
          
          <div style={{ opacity: 0.5, fontSize: "0.8rem" }}>•</div>

          <div style={{ fontSize: "0.875rem" }}>
            &copy; {new Date().getFullYear()} Dibuat dengan ❤️ oleh Maulana Muhammad
          </div>
        </div>
      </footer>
    </main>
  );
}
