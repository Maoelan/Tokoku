"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

type User = {
  id: string;
  name: string;
  role: string;
};

export default function Login() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin && users.length > 0) {
      handleDemoLogin(users[0]);
    }
  };

  const handleDemoLogin = (user: User) => {
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
          {users.map((user) => (
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
