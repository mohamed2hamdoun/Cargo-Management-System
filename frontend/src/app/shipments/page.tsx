"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Customer = {
  id: number;
  name: string;
};

type Shipment = {
  id: number;
  tracking_number: string;
  customer_id: number;
  origin_address_id: number;
  destination_address_id: number;
  status: string;
  service_type?: string | null;
  weight_kg?: number | null;
  base_price?: number | null;
  total_price?: number | null;
  currency: string;
  created_at: string;
};

type ShipmentCreate = {
  tracking_number: string;
  customer_id: number;
  origin_address_id: number;
  destination_address_id: number;
  status?: string;
  service_type?: string;
  weight_kg?: number;
  base_price?: number;
  total_price?: number;
  currency?: string;
};

export default function ShipmentsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For now, origin/destination are just numeric IDs.
  const [form, setForm] = useState<ShipmentCreate>({
    tracking_number: "",
    customer_id: 0,
    origin_address_id: 1,
    destination_address_id: 2,
    status: "created",
    service_type: "standard",
    weight_kg: 0,
    base_price: 0,
    total_price: 0,
    currency: "AED",
  });

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [customersData, shipmentsData] = await Promise.all([
        apiGet<Customer[]>("/customers"),
        apiGet<Shipment[]>("/shipments"),
      ]);

      setCustomers(customersData);
      setShipments(shipmentsData);
    } catch (e: any) {
      setError(e.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "customer_id" ||
        name === "origin_address_id" ||
        name === "destination_address_id" ||
        name === "weight_kg" ||
        name === "base_price" ||
        name === "total_price"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.tracking_number.trim()) {
      alert("Tracking number is required");
      return;
    }
    if (!form.customer_id) {
      alert("Customer is required");
      return;
    }

    try {
      setError(null);
      await apiPost<ShipmentCreate, Shipment>("/shipments", form);

      setForm((prev) => ({
        ...prev,
        tracking_number: "",
        weight_kg: 0,
        base_price: 0,
        total_price: 0,
      }));

      await loadData();
    } catch (e: any) {
      setError(e.message ?? "Failed to create shipment");
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <h1>Shipments</h1>

      {error && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
      )}

      {/* Create shipment form */}
      <section
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #ffffffff",
          borderRadius: 8,
        }}
      >
        <h2>Create shipment</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "0.5rem", maxWidth: 500 }}
        >
          <label>
            Tracking number *
            <input
              name="tracking_number"
              value={form.tracking_number}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem" ,border:"1px solid #ffffffff"}}
              required
            />
          </label>

          <label>
            Customer *
            <select
              name="customer_id"
              value={form.customer_id || ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
              required
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Origin address ID
            <input
              name="origin_address_id"
              type="number"
              value={form.origin_address_id ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Destination address ID
            <input
              name="destination_address_id"
              type="number"
              value={form.destination_address_id ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Status
            <input
              name="status"
              value={form.status ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Service type
            <input
              name="service_type"
              value={form.service_type ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Weight (kg)
            <input
              name="weight_kg"
              type="number"
              step="0.01"
              value={form.weight_kg ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Base price
            <input
              name="base_price"
              type="number"
              step="0.01"
              value={form.base_price ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Total price
            <input
              name="total_price"
              type="number"
              step="0.01"
              value={form.total_price ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <label>
            Currency
            <input
              name="currency"
              value={form.currency ?? ""}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.4rem",border:"1px solid #ffffffff" }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Create shipment
          </button>
        </form>
      </section>

      {/* Shipments table */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Existing shipments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : shipments.length === 0 ? (
          <p>No shipments yet.</p>
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
                <th style={{ borderBottom: "1px solid #ffffffff", textAlign: "left" }}>
                  ID
                </th>
                <th style={{ borderBottom: "1px solid #ffffffff", textAlign: "left" }}>
                  Tracking #
                </th>
                <th style={{ borderBottom: "1px solid #ffffffff", textAlign: "left" }}>
                  Customer ID
                </th>
                <th style={{ borderBottom: "1px solid #ffffffff", textAlign: "left" }}>
                  Status
                </th>
                <th style={{ borderBottom: "1px solid #ffffffff", textAlign: "left" }}>
                  Base / Total
                </th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id}>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{s.id}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{s.tracking_number}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{s.customer_id}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>{s.status}</td>
                  <td style={{ padding: "0.4rem 0.8rem" }}>
                    {s.base_price ?? 0} / {s.total_price ?? 0} {s.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
