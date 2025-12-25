# app/api/v1/customers.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerRead

router = APIRouter()


# CREATE
@router.post(
    "",
    response_model=CustomerRead,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    customer_in: CustomerCreate,
    db: Session = Depends(get_db),
):
    customer = Customer(**customer_in.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


# READ ALL
@router.get(
    "",
    response_model=List[CustomerRead],
)
def list_customers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    customers = db.query(Customer).offset(skip).limit(limit).all()
    return customers


# READ ONE
@router.get(
    "/{customer_id}",
    response_model=CustomerRead,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).get(customer_id)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )
    return customer
