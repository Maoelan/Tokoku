"use client";

import { useState, useEffect } from "react";
import styles from "./riwayat.module.css";

type SaleItem = {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  subtotal: number;
  productName: string;
};

type Sale = {
  id: number;
  totalAmount: number;
  totalItems: number;
  notes: string | null;
  createdAt: string;
  userName: string;
  userId: string;
  items: SaleItem[];
};

export default function RiwayatPenjualan() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch("/api/sales/history");
        const data = await res.json();
        setSales(data);
      } catch (error) {
        console.error("Failed to fetch sales history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>📋</span> Riwayat Penjualan</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          Memuat riwayat...
        </div>
      ) : (
        <div className={styles.historyList}>
          {sales.map((sale) => (
            <div key={sale.id} className={styles.historyCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span className={styles.txId}>Trx #{sale.id.toString().padStart(4, "0")}</span>
                  <span className={styles.txDate}>{formatDate(sale.createdAt)}</span>
                </div>
                <span className={styles.txOperator}>👤 {sale.userName || "Unknown"}</span>
              </div>

              <div className={styles.itemList}>
                {sale.items.map((item) => (
                  <div key={item.id} className={styles.itemRow}>
                    <span className={styles.itemName}>
                      {item.quantity}x {item.productName || "Barang Dihapus"}
                    </span>
                    <span className={styles.itemSubtotal}>
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.totalLabel}>Total Transaksi</span>
                <span className={styles.totalAmount}>
                  {formatRupiah(sale.totalAmount)}
                </span>
              </div>
            </div>
          ))}

          {sales.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              Belum ada riwayat penjualan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
