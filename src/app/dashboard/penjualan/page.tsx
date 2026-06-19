"use client";

import { useState } from "react";
import styles from "./penjualan.module.css";
import { products, Product } from "@/lib/data";

type CartItem = {
  product: Product;
  quantity: number;
};

export default function InputPenjualan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter products based on search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.is_active
  );

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price_sell * item.quantity,
    0
  );

  const handleSimpan = () => {
    if (cart.length === 0) return;
    alert("✅ Penjualan Berhasil Disimpan! (Mock Frontend)");
    setCart([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}><span>🛒</span> Catat Penjualan</h1>
      </div>

      <div className={styles.grid}>
        {/* Product Selection */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pilih Barang</h2>
          <input
            type="text"
            className={styles.searchBox}
            placeholder="Cari nama barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.productList}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productPrice}>
                    {formatRupiah(product.price_sell)}
                  </span>
                  <span className={styles.productStock}>
                    Stok: {product.stock} {product.unit}
                  </span>
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  title="Tambah ke struk"
                >
                  +
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className={styles.emptyCart}>Barang tidak ditemukan.</div>
            )}
          </div>
        </div>

        {/* Cart / Struk */}
        <div className={styles.section} style={{ display: "flex", flexDirection: "column" }}>
          <h2 className={styles.sectionTitle}>Daftar Belanja (Struk)</h2>

          <div className={styles.cartList}>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>Belum ada barang dipilih.</div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.cartItemName}>{item.product.name}</div>
                    <div className={styles.cartItemPrice}>
                      {formatRupiah(item.product.price_sell)}
                    </div>
                  </div>
                  <div className={styles.cartItemControls}>
                    <button
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.product.id, -1)}
                    >
                      -
                    </button>
                    <span className={styles.qtyText}>{item.quantity}</span>
                    <button
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.cartSubtotal}>
                    {formatRupiah(item.product.price_sell * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Bayar</span>
              <span className={styles.totalAmount}>
                {formatRupiah(totalAmount)}
              </span>
            </div>
            <button
              className={styles.submitBtn}
              disabled={cart.length === 0}
              onClick={handleSimpan}
            >
              Simpan Penjualan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
