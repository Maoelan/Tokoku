"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { mockUsers, User } from "@/lib/data";

export default function Login() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate generic operator login for demo if PIN is entered
    if (pin) {
      handleDemoLogin(mockUsers[0]);
    }
  };

  const handleDemoLogin = (user: User) => {
    // In a real app, we'd use Context or cookies.
    // For this frontend-only mock, we'll store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tokoku_user", JSON.stringify(user));
    }
    router.push("/dashboard");
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
            />
          </div>
          <button type="submit" className={styles.button}>
            Masuk
          </button>
        </form>

        <div className={styles.demoSwitcher}>
          <div className={styles.demoTitle}>Demo Akses Cepat</div>
          {mockUsers.map((user) => (
            <button
              key={user.id}
              className={styles.demoBtn}
              onClick={() => handleDemoLogin(user)}
              type="button"
            >
              Masuk sebagai {user.name} ({user.role})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
