// frontend/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cargo Management System",
  description: "Shipping management app (FastAPI + Next.js)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: "#080808ff",
        }}
      >
        {/* Top navigation bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#111827",
            color: "white",
          }}
        >
          <div style={{ fontWeight: 600 }}>Cargo Management</div>
          <nav style={{ display: "flex", gap: "1rem", fontSize: "0.95rem" }}>
            <Link href="/" style={{ textDecoration: "none", color: "white" }}>
              Home
            </Link>
            <Link
              href="/customers"
              style={{ textDecoration: "none", color: "white" }}
            >
              Customers
            </Link>
            <Link
              href="/shipments"
              style={{ textDecoration: "none", color: "white" }}
            >
              Shipments
            </Link>
          </nav>
        </header>

        {/* Page content */}
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </body>
    </html>
  );
}
