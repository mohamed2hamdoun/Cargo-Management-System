# app/models/shipment.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    tracking_number = Column(String, unique=True, index=True, nullable=False)

    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    origin_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    destination_address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)

    status = Column(String, default="created", nullable=False)
    service_type = Column(String)  # standard, express

    weight_kg = Column(Float)
    volume_cbm = Column(Float)

    base_price = Column(Float)
    total_price = Column(Float)
    currency = Column(String, default="AED")

    scheduled_pickup_at = Column(DateTime)
    scheduled_delivery_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="shipments")
    origin_address = relationship("Address", foreign_keys=[origin_address_id])
    destination_address = relationship("Address", foreign_keys=[destination_address_id])

    tracking_events = relationship(
        "TrackingEvent", back_populates="shipment", cascade="all, delete-orphan"
    )
    invoice = relationship(
        "Invoice", back_populates="shipment", uselist=False, cascade="all, delete-orphan"
    )
