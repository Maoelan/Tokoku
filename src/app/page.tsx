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

  const filteredProducts =
    activeCategoryId === "all"
      ? products.filter((p) => p.showOnLanding && p.isActive)
      : products.filter(
          (p) =>
            p.categoryId === activeCategoryId &&
            p.showOnLanding &&
            p.isActive,
        );

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

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${activeCategoryId === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setActiveCategoryId("all")}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeCategoryId === cat.id ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategoryId(cat.id)}
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
              {filteredProducts.map((product) => (
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

            {filteredProducts.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  marginTop: "2rem",
                }}
              >
                Belum ada produk di kategori ini.
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContent}`}>
          <div className={styles.footerLogoContainer}>
            <img
              src="/images/logo.png"
              alt="Logo Tokoku Sintung"
              className={styles.footerLogo}
            />
          </div>
          <div style={{ fontWeight: 600, fontSize: "1.25rem" }}>
            Tokoku Sintung
          </div>
          <div>📍 Lokasi: Sintung, Lombok Tengah</div>
          <div>🕐 Jam Buka: 10.00 - 20.00</div>
          <div>📞 WhatsApp: 0817-578-6554</div>
          <a
            href="https://wa.me/628175786553"
            style={{
              color: "var(--primary-hover)",
              fontWeight: 500,
              marginTop: "0.5rem",
              display: "inline-block",
            }}
          >
            Kirim Pesan via WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );
}
