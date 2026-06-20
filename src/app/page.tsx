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
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.error("Products API error:", productsData);
          setProducts([]);
        }

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error("Categories API error:", categoriesData);
          setCategories([]);
        }
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

          <div className={styles.featureBar}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>⚡</span> Pelayanan Cepat
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>💯</span> Harga Jujur
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🛒</span> Stok Lengkap
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
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cari barang (misal: Surya, Kopi, Gula)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(12); // Reset limit on search
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
                  className={styles.loadMoreBtn}
                  onClick={() => setDisplayLimit((prev) => prev + 12)}
                >
                  Lihat Lebih Banyak ({filteredProducts.length - displayedProducts.length} lagi) ⬇️
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>🔍</div>
                <h3 className={styles.emptyStateTitle}>Barang Tidak Ditemukan</h3>
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
