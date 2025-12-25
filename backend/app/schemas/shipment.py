# app/schemas/shipment.py
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ShipmentBase(BaseModel):
    tracking_number: str
    customer_id: int
    origin_address_id: int
    destination_address_id: int

    status: str = "created"        # created, picked_up, in_transit, delivered, etc.
    service_type: Optional[str] = None  # standard, express

    weight_kg: Optional[float] = None
    volume_cbm: Optional[float] = None

    base_price: Optional[float] = None
    total_price: Optional[float] = None
    currency: str = "AED"

    scheduled_pickup_at: Optional[datetime] = None
    scheduled_delivery_at: Optional[datetime] = None


class ShipmentCreate(ShipmentBase):
    pass


class ShipmentRead(ShipmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
