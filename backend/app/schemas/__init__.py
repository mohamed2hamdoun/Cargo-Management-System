# app/schemas/__init__.py
from .customer import CustomerBase, CustomerCreate, CustomerRead
from .shipment import ShipmentBase, ShipmentCreate, ShipmentRead
from .tracking_event import TrackingEventBase, TrackingEventCreate, TrackingEventRead
__all__ = [
    "CustomerBase",
    "CustomerCreate",
    "CustomerRead",
    "ShipmentBase",
    "ShipmentCreate",
    "ShipmentRead",
    "TrackingEventBase",
    "TrackingEventCreate", 
    "TrackingEventRead"
]