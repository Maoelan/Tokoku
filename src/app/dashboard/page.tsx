"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./summary.module.css";

type User = {
  id: string;
  name: string;
  role: string;
};

type SummaryData = {
  salesToday: number;
  itemsToday: number;
  lowStockCount: number;
};

type Product = {
  id: number;
  name: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
};

export default function DashboardSummary() {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("tokoku_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    async function fetchData() {
      try {
        const [summaryRes, productsRes] = await Promise.all([
          fetch("/api/dashboard/summary"),
          fetch("/api/products"),
        ]);
        const summaryData = await summaryRes.json();
        const productsData = await productsRes.json();

        setSummary(summaryData);
        setLowStockItems(
          productsData.filter((p: Product) => p.stock <= p.lowStockThreshold)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.greeting}>Selamat Siang, {user.name}! 👋</h1>
        <div className={styles.date}>
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconSales}`}>💰</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Penjualan Hari Ini</span>
            <span className={styles.statValue}>
              {loading ? "..." : formatRupiah(summary?.salesToday ?? 0)}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconItems}`}>📦</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Barang Terjual</span>
            <span className={styles.statValue}>
              {loading ? "..." : `${summary?.itemsToday ?? 0} item`}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconAlert}`}>⚠️</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Stok Hampir Habis</span>
            <span className={styles.statValue}>
              {loading ? "..." : `${summary?.lowStockCount ?? 0} barang`}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.ctaContainer}>
        <Link href="/dashboard/penjualan" className={styles.ctaButton}>
          <span>🛒</span> Catat Penjualan
        </Link>
      </div>

      {lowStockItems.length > 0 && (
        <div className={styles.lowStockSection}>
          <h2 className={styles.sectionTitle}>
            <span>⚠️</span> Perlu Restok Segera
          </h2>
          <div className={styles.stockList}>
            {lowStockItems.map((item) => (
              <div key={item.id} className={styles.stockItem}>
                <span className={styles.stockName}>{item.name}</span>
                <span className={styles.stockStatus}>
                  Sisa {item.stock} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
