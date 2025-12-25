# app/api/v1/__init__.py
from fastapi import APIRouter

from .customers import router as customers_router
from .shipments import router as shipments_router
from .tracking_events import router as tracking_events_router

api_router = APIRouter()
api_router.include_router(customers_router, prefix="/customers", tags=["customers"])
api_router.include_router(shipments_router, prefix="/shipments", tags=["shipments"])
api_router.include_router(
    tracking_events_router, prefix="/tracking-events", tags=["tracking_events"]
)
