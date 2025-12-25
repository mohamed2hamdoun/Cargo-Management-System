# app/models/address.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.core.db import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)  # origin, destination, warehouse

    line1 = Column(String, nullable=False)
    line2 = Column(String)
    city = Column(String, nullable=False)
    state = Column(String)
    country = Column(String, nullable=False)
    postal_code = Column(String)

    latitude = Column(Float)
    longitude = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
