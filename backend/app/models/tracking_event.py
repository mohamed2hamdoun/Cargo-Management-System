from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.db import Base


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False, index=True)

    status = Column(String, nullable=False)
    location_text = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    description = Column(String)

    event_time = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="tracking_events")
