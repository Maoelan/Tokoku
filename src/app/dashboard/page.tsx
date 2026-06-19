"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./summary.module.css";
import { mockSales, products, User } from "@/lib/data";

export default function DashboardSummary() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("tokoku_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate today's stats from mock data
  const todaySales = mockSales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const todayItems = mockSales.reduce((sum, sale) => sum + sale.total_items, 0);
  
  // Find low stock items
  const lowStockItems = products.filter(p => p.stock <= p.low_stock_threshold);

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
            <span className={styles.statValue}>{formatRupiah(todaySales)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconItems}`}>📦</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Barang Terjual</span>
            <span className={styles.statValue}>{todayItems} item</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconAlert}`}>⚠️</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Stok Hampir Habis</span>
            <span className={styles.statValue}>{lowStockItems.length} barang</span>
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
            {lowStockItems.map(item => (
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
