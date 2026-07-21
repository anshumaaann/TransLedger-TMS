from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


# Create Customer
@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    return CustomerService.create_customer(db, customer)


# Get All Customers
@router.get("/", response_model=list[CustomerResponse])
def get_all_customers(
    db: Session = Depends(get_db),
):
    return CustomerService.get_all_customers(db)


# Get Customer By ID
@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_by_id(
    customer_id: UUID,
    db: Session = Depends(get_db),
):
    customer = CustomerService.get_customer_by_id(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer


# Update Customer
@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: UUID,
    customer: CustomerUpdate,
    db: Session = Depends(get_db),
):
    updated_customer = CustomerService.update_customer(
        db,
        customer_id,
        customer,
    )

    if updated_customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return updated_customer


# Soft Delete Customer
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
):
    customer = CustomerService.delete_customer(
        db,
        customer_id,
    )

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return {
        "message": "Customer deleted successfully"
    }