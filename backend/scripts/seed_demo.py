# scripts/seed_demo.py
from datetime import datetime

from app.core.db import SessionLocal, init_db
from app.models.customer import Customer
from app.models.address import Address
from app.models.shipment import Shipment
from app.models.tracking_event import TrackingEvent


def main():
    # Ensure tables exist
    init_db()

    db = SessionLocal()

    try:
        # 1) Create a customer
        customer = Customer(
            name="Demo Customer",
            contact_person="Ahmed",
            email="demo@example.com",
            phone="+971500000000",
            billing_address_line1="Demo Street 1",
            city="Dubai",
            country="UAE",
            postal_code="00000",
        )

        # 2) Create origin & destination addresses
        origin = Address(
            label="origin",
            line1="Warehouse 1",
            city="Dubai",
            country="UAE",
        )

        destination = Address(
            label="destination",
            line1="Customer Location",
            city="Abu Dhabi",
            country="UAE",
        )

        # Add to session so they get IDs
        db.add(customer)
        db.add(origin)
        db.add(destination)
        db.flush()  # get IDs without committing yet

        # 3) Create a shipment
        shipment = Shipment(
            tracking_number="TRK123456",
            customer_id=customer.id,
            origin_address_id=origin.id,
            destination_address_id=destination.id,
            status="created",
            service_type="standard",
            weight_kg=10.5,
            base_price=100.0,
            total_price=120.0,
            currency="AED",
            scheduled_pickup_at=datetime.utcnow(),
        )
        db.add(shipment)
        db.flush()

        # 4) First tracking event
        event = TrackingEvent(
            shipment_id=shipment.id,
            status="created",
            location_text="Dubai Warehouse",
            event_time=datetime.utcnow(),
        )
        db.add(event)

        # 5) Commit all
        db.commit()

        print("Seed data inserted successfully.")

    except Exception as e:
        db.rollback()
        print("Error while seeding:", e)
    finally:
        db.close()


if __name__ == "__main__":
    main()
