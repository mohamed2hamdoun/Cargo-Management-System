# app/models/payment.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)

    amount = Column(Float, nullable=False)
    currency = Column(String, default="AED")
    method = Column(String, nullable=False)  # card, bank_transfer, cash, etc.
    transaction_reference = Column(String)
    status = Column(String, default="pending")  # pending, succeeded, failed

    paid_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")
