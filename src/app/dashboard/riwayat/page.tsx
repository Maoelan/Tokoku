"use client";

import styles from "./riwayat.module.css";
import { mockSales, mockUsers, products } from "@/lib/data";

export default function RiwayatPenjualan() {
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

  const getUserName = (userId: string) => {
    return mockUsers.find(u => u.id === userId)?.name || "Unknown";
  };

  const getProductName = (productId: number) => {
    return products.find(p => p.id === productId)?.name || "Barang Dihapus";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>📋</span> Riwayat Penjualan</h1>
      </div>

      <div className={styles.historyList}>
        {mockSales.map((sale) => (
          <div key={sale.id} className={styles.historyCard}>
            <div className={styles.cardHeader}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span className={styles.txId}>Trx #{sale.id.toString().padStart(4, "0")}</span>
                <span className={styles.txDate}>{formatDate(sale.created_at)}</span>
              </div>
              <span className={styles.txOperator}>👤 {getUserName(sale.user_id)}</span>
            </div>

            <div className={styles.itemList}>
              {sale.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <span className={styles.itemName}>
                    {item.quantity}x {getProductName(item.product_id)}
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
                {formatRupiah(sale.total_amount)}
              </span>
            </div>
          </div>
        ))}

        {mockSales.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            Belum ada riwayat penjualan.
          </div>
        )}
      </div>
    </div>
  );
}
