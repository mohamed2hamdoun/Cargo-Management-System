// frontend/app/page.tsx

export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Cargo Management Dashboard</h1>
      <p style={{ marginTop: "0.5rem", color: "#ffffffff" }}>
        Manage customers, shipments, and tracking events for your shipping
        company.
      </p>

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderRadius: 8,
            border: "1px solid #0040ffff",
            backgroundColor: "white",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem",color: "#000000ff" }}>
            Customers
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#000000ff" }}>
            Create and manage customers that own shipments.
          </p>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: 8,
            border: "1px solid #000000ff",
            backgroundColor: "white",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem",color: "#000000ff" }}>
            Shipments
          </h2>
          <p style={{ fontSize: "0.9rem",color: "#000000ff" }}>
            Create shipments, set prices, and see their current status.
          </p>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: 8,
            border: "1px solid #000000ff",
            backgroundColor: "white",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem",color: "#000000ff" }}>
            Tracking (coming next)
          </h2>
          <p style={{ fontSize: "0.9rem",color: "#000000ff" }}>
            View the full tracking history for each shipment.
          </p>
        </div>
      </section>
    </main>
  );
}
