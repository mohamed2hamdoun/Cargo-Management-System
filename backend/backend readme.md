<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# put it all in the .md file that i ca use and I think the examples of the models are too much

```markdown
# Cargo Management System – Backend (FastAPI + SQLAlchemy + PostgreSQL)

A backend API for managing a shipping company’s core operations: customers, shipments, and shipment tracking timelines. Built for learning, portfolio, and future SaaS scaling. [web:197][web:212]

---

## Tech stack

- **Language**: Python 3.11+
- **Framework**: FastAPI (async web framework with automatic docs) [web:97]
- **ORM**: SQLAlchemy ORM (synchronous) [web:197]
- **Database**: PostgreSQL
- **Serialization**: Pydantic models (request/response schemas) [web:97]
- **Server**: Uvicorn

The structure follows common FastAPI + SQLAlchemy CRUD patterns used in production-style tutorials and templates. [web:197][web:212]

---

## Project structure

Backend root:

```

backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   └── db.py          \# engine, SessionLocal, Base, get_db, init_db
│   │
│   ├── models/            \# SQLAlchemy ORM models (DB tables)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── customer.py
│   │   ├── address.py
│   │   ├── shipment.py
│   │   ├── tracking_event.py
│   │   ├── invoice.py
│   │   └── payment.py
│   │
│   ├── schemas/           \# Pydantic models (API I/O)
│   │   ├── __init__.py
│   │   ├── customer.py
│   │   ├── shipment.py
│   │   └── tracking_event.py
│   │
│   └── api/
│       ├── __init__.py
│       └── v1/
│           ├── __init__.py
│           ├── customers.py
│           ├── shipments.py
│           └── tracking_events.py
│
├── scripts/
│   └── seed_demo.py
│
├── .env
├── requirements.txt
└── README.md

```

- `core/`: DB engine, session factory, base class, and init logic.
- `models/`: database tables as SQLAlchemy ORM classes.
- `schemas/`: Pydantic request/response models.
- `api/v1/`: versioned routers for each feature.
- `scripts/`: utility scripts (e.g., data seeding).

This layout is similar to recommended “bigger applications” / “production” structures. [web:97][web:231]

---

## Domain model & database schema (high-level)

### Entities

- **Customer**
  - Represents the client (company/person) that owns shipments and receives invoices.
  - Key fields: name, contact_person, email, phone, billing address fields, created_at, updated_at.
- **Address**
  - Reusable physical locations.
  - Key fields: label (origin/destination/warehouse), line1, city, country, postal_code, optional latitude/longitude.
- **Shipment**
  - Core entity representing a shipment from origin to destination for a customer.
  - Key fields: tracking_number, customer_id, origin_address_id, destination_address_id, status, service_type, weight/volume, base_price, total_price, currency, scheduled_pickup_at, scheduled_delivery_at, timestamps.
- **TrackingEvent**
  - Timeline events for a shipment (tracking history).
  - Key fields: shipment_id, status, location_text, optional coordinates, description, event_time, created_at.
- **Invoice** (prepared for future use)
  - One invoice per shipment, linked to customer.
  - Key fields: shipment_id, customer_id, invoice_number, amount, currency, status, issued_at, due_at, paid_at, timestamps.
- **Payment** (prepared for future use)
  - Payments made against an invoice.
  - Key fields: invoice_id, amount, currency, method, transaction_reference, status, timestamps.
- **User** (prepared for future auth)
  - Internal/admin/operator accounts.
  - Key fields: email, password_hash, full_name, role, is_active, timestamps.

These entities follow common logistics/shipping management concepts: customers, shipments, tracking, and billing. [web:64][web:67][web:78][web:294]

### Relationships

- One **Customer** → many **Shipments**.
- One **Customer** → many **Invoices**.
- One **Shipment** → one **Customer**.
- One **Shipment** → one **origin Address** and one **destination Address**.
- One **Shipment** → many **TrackingEvents**.
- One **Shipment** → one **Invoice**.
- One **Invoice** → many **Payments**.

This design allows listing all shipments for a customer, seeing full tracking history for a shipment, and (later) linking financial records. [web:78][web:291][web:295]

---

## API design and workflows

Base URL (local): `http://127.0.0.1:8000`  

- Interactive docs: `http://127.0.0.1:8000/docs` (Swagger UI) [web:97]  
- Health check: `GET /health` → `{ "status": "ok" }`

All functional endpoints are versioned under `/api/v1`.

### Main workflows

1. **Customer management**
   - Create customers via API.
   - Use customer IDs when creating shipments.

2. **Shipment lifecycle**
   - Create shipments for a customer with origin/destination addresses and pricing.
   - Track status evolution (`created`, `picked_up`, `in_transit`, `delivered`, etc.) through tracking events.

3. **Tracking visibility**
   - Attach `TrackingEvent` records to shipments as they move.
   - Retrieve ordered tracking timeline per shipment.

These flows match key features described for shipping/logistics systems (customer management, shipment handling, tracking). [web:22][web:78][web:292][web:294]

### Endpoints: Customers

Prefix: `/api/v1/customers`  
Tag: `customers`

- `POST /`
  - Body: `CustomerCreate` (Pydantic).
  - Creates a new customer record.
- `GET /`
  - Query: `skip`, `limit`.
  - Returns a paginated list of `CustomerRead`.
- `GET /{customer_id}`
  - Returns a single `CustomerRead` or 404 if not found.

I/O models (`CustomerCreate`, `CustomerRead`) are in `app/schemas/customer.py`, with `from_attributes=True` to map from ORM models. [web:97][web:200]

### Endpoints: Shipments

Prefix: `/api/v1/shipments`  
Tag: `shipments`

- `POST /`
  - Body: `ShipmentCreate`.
  - Creates a shipment linked to an existing customer and addresses.
- `GET /`
  - Query: `skip`, `limit`.
  - Returns a paginated list of `ShipmentRead`.
- `GET /{shipment_id}`
  - Returns a single `ShipmentRead` or 404.
- `DELETE /{shipment_id}`
  - Deletes a shipment (and its tracking events via cascading) or returns 404.

I/O models (`ShipmentCreate`, `ShipmentRead`) are in `app/schemas/shipment.py`. [web:97]

### Endpoints: Tracking events

Prefix: `/api/v1/tracking-events`  
Tag: `tracking_events`

- `POST /`
  - Body: `TrackingEventCreate` (includes `shipment_id`).
  - Validates that the shipment exists, then creates a new tracking event row.
- `GET /by_shipment/{shipment_id}`
  - Returns a list of `TrackingEventRead` ordered by `event_time` for the given shipment.

I/O models (`TrackingEventCreate`, `TrackingEventRead`) are in `app/schemas/tracking_event.py`. [web:97][web:223]

---

## Backend architecture

### Core DB module (`app/core/db.py`)

- Reads `DATABASE_URL` from environment (e.g. via `.env`).
- Creates SQLAlchemy engine bound to PostgreSQL.
- Sets up `SessionLocal` (session factory).
- Defines `Base = declarative_base()` as the parent class for all models.
- Exposes:
  - `get_db()`: FastAPI dependency that provides a DB session per request and closes it afterwards.
  - `init_db()`: imports `app.models` and calls `Base.metadata.create_all()` to create tables on startup. [web:197][web:229]

### App entrypoint (`app/main.py`)

- Instantiates `FastAPI` with title and version.
- `startup` event calls `init_db()` to ensure schema exists before handling requests.
- Includes the `api_router` from `app/api/v1` under `/api/v1`.
- Exposes a simple `/health` endpoint.

This pattern mirrors standard FastAPI + SQLAlchemy integration examples. [web:97][web:197][web:212]

### Routers (`app/api/v1/*.py`)

- Each router (`customers.py`, `shipments.py`, `tracking_events.py`) defines:
  - Route functions (CRUD operations).
  - Dependencies: `db: Session = Depends(get_db)`.
  - Input models: `*Create` Pydantic schemas.
  - Output models: `*Read` Pydantic schemas (`response_model=...`).

Routes are combined in `app/api/v1/__init__.py` as a single `api_router` using `include_router`. [web:97]

---

## Scripts

### `scripts/seed_demo.py`

- Ensures tables are created by calling `init_db()`.
- Inserts demo data:
  - 1 `Customer` (Demo Customer).
  - 2 `Address` rows (origin and destination).
  - 1 `Shipment` referencing that customer and those addresses.
  - 1 `TrackingEvent` for the shipment.

Run from `backend/`:

```

python -m scripts.seed_demo

```

This helps quickly populate data for testing or screenshots.

---

## Setup & usage

### 1. Install dependencies

From `backend/`:

```

python -m venv venv

# Windows:

venv\Scripts\activate

# macOS/Linux:

source venv/bin/activate

pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv

```

### 2. Configure PostgreSQL

- Create a database (e.g. `shipping_db`).
- Add a `.env` file in `backend/`:

```

DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/shipping_db

```

### 3. Run the API

```

uvicorn app.main:app --reload

```

- Health check: `GET http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs` (auto-generated from routes and schemas). [web:97]

### 4. (Optional) Seed demo data

```

python -m scripts.seed_demo

```

After this you can immediately use the API to list shipments, customers, and tracking events.

---

## Next steps (for this project)

- Add authentication and roles (admin/operator/customer_user).
- Expose invoice and payment endpoints.
- Build a Next.js frontend (`frontend/`) that calls these endpoints (admin dashboard + tracking UI).
- Containerize with Docker and add `docker-compose` (backend + Postgres) for easier deployment. [web:229][web:240]

```

