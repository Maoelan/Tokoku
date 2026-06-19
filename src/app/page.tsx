"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { categories, products, Product } from "@/lib/data";

export default function Home() {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1); // 1 = Semua

  const filteredProducts =
    activeCategoryId === 1
      ? products.filter((p) => p.show_on_landing && p.is_active)
      : products.filter(
          (p) =>
            p.category_id === activeCategoryId &&
            p.show_on_landing &&
            p.is_active,
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
    if (product.stock <= product.low_stock_threshold) {
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

        {/* Product Grid */}
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.cardImgPlaceholder}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <span>📦</span>
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                {renderStockBadge(product)}
                <div className={styles.cardPrice}>
                  {formatRupiah(product.price_sell)}
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
