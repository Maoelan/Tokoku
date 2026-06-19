"use client";

import { useState, useEffect } from "react";
import styles from "./penjualan.module.css";

type Product = {
  id: number;
  name: string;
  unit: string;
  stock: number;
  priceSell: number;
  isActive: boolean;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function InputPenjualan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.isActive
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
        if (existing.quantity + 1 > product.stock) {
          alert(`Stok tidak cukup! Sisa stok ${product.name} hanya ${product.stock} ${product.unit}.`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (1 > product.stock) {
        alert(`Stok tidak cukup! Sisa stok ${product.name} hanya ${product.stock} ${product.unit}.`);
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => {
      const itemToUpdate = prev.find((item) => item.product.id === productId);
      if (itemToUpdate && delta > 0 && itemToUpdate.quantity + delta > itemToUpdate.product.stock) {
        alert(`Stok tidak cukup! Sisa stok ${itemToUpdate.product.name} hanya ${itemToUpdate.product.stock} ${itemToUpdate.product.unit}.`);
        return prev;
      }

      return prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.priceSell * item.quantity,
    0
  );

  const handleSimpan = async () => {
    if (cart.length === 0) return;

    const storedUser = localStorage.getItem("tokoku_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    setSaving(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "1",
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.priceSell,
          })),
          notes: "",
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Penjualan Berhasil Disimpan!");
        setCart([]);
        // Refresh products to get updated stock
        const updatedProducts = await fetch("/api/products");
        setProducts(await updatedProducts.json());
      } else {
        alert("❌ Gagal menyimpan: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Gagal menyimpan penjualan. Coba lagi.");
    } finally {
      setSaving(false);
    }
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
            {loading ? (
              <div className={styles.emptyCart}>Memuat barang...</div>
            ) : (
              <>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.productPrice}>
                        {formatRupiah(product.priceSell)}
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
              </>
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
                      {formatRupiah(item.product.priceSell)}
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
                    {formatRupiah(item.product.priceSell * item.quantity)}
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
              disabled={cart.length === 0 || saving}
              onClick={handleSimpan}
            >
              {saving ? "Menyimpan..." : "Simpan Penjualan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
