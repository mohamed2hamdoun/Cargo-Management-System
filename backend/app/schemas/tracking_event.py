from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TrackingEventBase(BaseModel):
    shipment_id: int
    status: str                  # picked_up, in_transit, delivered, etc.
    location_text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    event_time: Optional[datetime] = None


class TrackingEventCreate(TrackingEventBase):
    pass


class TrackingEventRead(TrackingEventBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
