from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.broker import (
    BrokerCreate,
    BrokerResponse,
    BrokerUpdate,
)
from app.services.broker_service import BrokerService

router = APIRouter(
    prefix="/brokers",
    tags=["Brokers"],
)


# Create Broker
@router.post("/", response_model=BrokerResponse)
def create_broker(
    broker: BrokerCreate,
    db: Session = Depends(get_db),
):
    return BrokerService.create_broker(db, broker)


# Get All Brokers
@router.get("/", response_model=list[BrokerResponse])
def get_all_brokers(
    db: Session = Depends(get_db),
):
    return BrokerService.get_all_brokers(db)


# Get Broker By ID
@router.get("/{broker_id}", response_model=BrokerResponse)
def get_broker_by_id(
    broker_id: UUID,
    db: Session = Depends(get_db),
):
    broker = BrokerService.get_broker_by_id(
        db,
        broker_id,
    )

    if broker is None:
        raise HTTPException(
            status_code=404,
            detail="Broker not found",
        )

    return broker


# Update Broker
@router.put("/{broker_id}", response_model=BrokerResponse)
def update_broker(
    broker_id: UUID,
    broker: BrokerUpdate,
    db: Session = Depends(get_db),
):
    updated_broker = BrokerService.update_broker(
        db,
        broker_id,
        broker,
    )

    if updated_broker is None:
        raise HTTPException(
            status_code=404,
            detail="Broker not found",
        )

    return updated_broker


# Soft Delete Broker
@router.delete("/{broker_id}")
def delete_broker(
    broker_id: UUID,
    db: Session = Depends(get_db),
):
    broker = BrokerService.delete_broker(
        db,
        broker_id,
    )

    if broker is None:
        raise HTTPException(
            status_code=404,
            detail="Broker not found",
        )

    return {
        "message": "Broker deleted successfully"
    }
