from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)
from app.services.vehicle_service import VehicleService

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


# Create Vehicle
@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
):
    return VehicleService.create_vehicle(db, vehicle)


# Get All Vehicles
@router.get("/", response_model=list[VehicleResponse])
def get_all_vehicles(
    db: Session = Depends(get_db),
):
    return VehicleService.get_all_vehicles(db)


# Get Vehicle By ID
@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle_by_id(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
):
    vehicle = VehicleService.get_vehicle_by_id(
        db,
        vehicle_id,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return vehicle


# Update Vehicle
@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: UUID,
    vehicle: VehicleUpdate,
    db: Session = Depends(get_db),
):
    updated_vehicle = VehicleService.update_vehicle(
        db,
        vehicle_id,
        vehicle,
    )

    if updated_vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return updated_vehicle


# Soft Delete Vehicle
@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: UUID,
    db: Session = Depends(get_db),
):
    vehicle = VehicleService.delete_vehicle(
        db,
        vehicle_id,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found",
        )

    return {
        "message": "Vehicle deleted successfully"
    }