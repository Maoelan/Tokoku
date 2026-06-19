"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./navigation.module.css";
import { User } from "@/lib/data";

export default function Navigation({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("tokoku_user");
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "Ringkasan", icon: "📊" },
    { href: "/dashboard/penjualan", label: "Penjualan", icon: "🛒" },
    { href: "/dashboard/barang", label: "Barang", icon: "📦" },
    { href: "/dashboard/riwayat", label: "Riwayat", icon: "📋" },
  ];

  // Admin-only links
  if (user.role === "admin") {
    navLinks.push({ href: "/dashboard/barang-masuk", label: "Restok", icon: "📥" });
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.header}>
        <img src="/images/logo.png" alt="Tokoku" className={styles.logo} />
        <div className={styles.title}>Tokoku Dashboard</div>
      </div>

      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            <div className={styles.icon}>{link.icon}</div>
            <span>{link.label}</span>
          </Link>
        );
      })}

      <div className={styles.userInfo}>
        <div className={styles.avatar}>{user.name.charAt(0)}</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Keluar</button>
        </div>
      </div>
    </nav>
  );
}
