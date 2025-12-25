from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.tracking_event import TrackingEvent
from app.models.shipment import Shipment
from app.schemas.tracking_event import TrackingEventCreate, TrackingEventRead

router = APIRouter()


@router.post(
    "/",
    response_model=TrackingEventRead,
    status_code=status.HTTP_201_CREATED,
)
def create_tracking_event(
    event_in: TrackingEventCreate,
    db: Session = Depends(get_db),
):
    # Ensure shipment exists
    shipment = db.query(Shipment).get(event_in.shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    data = event_in.model_dump()
    if data["event_time"] is None:
        from datetime import datetime as dt
        data["event_time"] = dt.utcnow()

    event = TrackingEvent(**data)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get(
    "/by_shipment/{shipment_id}",
    response_model=List[TrackingEventRead],
)
def list_events_for_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
):
    events = (
        db.query(TrackingEvent)
        .filter(TrackingEvent.shipment_id == shipment_id)
        .order_by(TrackingEvent.event_time.asc())
        .all()
    )
    return events
