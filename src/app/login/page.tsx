"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("tokoku_user", JSON.stringify(data.user));
        }
        router.push("/dashboard");
      } else {
        alert("❌ " + data.error);
        setPin("");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/images/logo.png" alt="Tokoku" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Masuk ke Tokoku</h1>
        <p className={styles.subtitle}>Sistem Manajemen Toko</p>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>PIN Akses</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Masukkan PIN Anda"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
