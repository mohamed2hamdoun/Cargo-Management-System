# app/models/customer.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)

    billing_address_line1 = Column(String)
    city = Column(String)
    country = Column(String)
    postal_code = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    shipments = relationship("Shipment", back_populates="customer")
    invoices = relationship("Invoice", back_populates="customer")
