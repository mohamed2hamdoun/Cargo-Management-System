# app/models/invoice.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    shipment_id = Column(
        Integer, ForeignKey("shipments.id"), unique=True, nullable=False
    )
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    invoice_number = Column(String, unique=True, index=True, nullable=False)

    amount = Column(Float, nullable=False)
    currency = Column(String, default="AED")
    status = Column(String, default="unpaid")  # unpaid, paid, canceled

    issued_at = Column(DateTime, default=datetime.utcnow)
    due_at = Column(DateTime)
    paid_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="invoice")
    customer = relationship("Customer", back_populates="invoices")
    payments = relationship(
        "Payment", back_populates="invoice", cascade="all, delete-orphan"
    )
