// frontend/app/customers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Customer = {
  id: number;
  name: string;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  created_at: string;
};

type CustomerCreate = {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  billing_address_line1?: string;
  city?: string;
  country?: string;
  postal_code?: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerCreate>({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  async function loadCustomers() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Customer[]>("/customers");
      setCustomers(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setError(null);
      await apiPost<CustomerCreate, Customer>("/customers", form);
      setForm({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        city: "",
        country: "",
      });
      await loadCustomers();
    } catch (e: any) {
      setError(e.message ?? "Failed to create customer");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Customers</h1>

      {/* Error message */}
      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {/* Create customer form */}
      <section
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>Create customer</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "0.5rem", maxWidth: 400 }}
        >
          <label>
            Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
              required
            />
          </label>
          <label>
            Contact person
            <input
              name="contact_person"
              value={form.contact_person}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>
          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>
          <label>
            Country
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Create
          </button>
        </form>
      </section>

      {/* Customers table */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Existing customers</h2>
        {loading ? (
          <p>Loading...</p>
        ) : customers.length === 0 ? (
          <p>No customers yet.</p>
        ) : (
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  ID
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Name
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Contact
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Email
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  City
                </th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{c.id}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{c.name}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>
                    {c.contact_person ?? "-"}
                  </td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{c.email ?? "-"}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{c.city ?? "-"}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{c.country ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
