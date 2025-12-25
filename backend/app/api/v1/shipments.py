# app/api/v1/shipments.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentRead

router = APIRouter()


# CREATE
@router.post(
    "/",
    response_model=ShipmentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_shipment(
    shipment_in: ShipmentCreate,
    db: Session = Depends(get_db),
):
    shipment = Shipment(**shipment_in.model_dump())
    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment


# READ ALL
@router.get(
    "/",
    response_model=List[ShipmentRead],
)
def list_shipments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    shipments = db.query(Shipment).offset(skip).limit(limit).all()
    return shipments


# READ ONE
@router.get(
    "/{shipment_id}",
    response_model=ShipmentRead,
)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
):
    shipment = db.query(Shipment).get(shipment_id)
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found",
        )
    return shipment


# OPTIONAL: DELETE (for practice)
@router.delete(
    "/{shipment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
):
    shipment = db.query(Shipment).get(shipment_id)
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found",
        )
    db.delete(shipment)
    db.commit()
    return None
