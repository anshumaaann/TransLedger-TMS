from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.location import (
    LocationCreate,
    LocationUpdate,
    LocationResponse,
)
from app.services.location_service import LocationService

router = APIRouter(
    prefix="/locations",
    tags=["Locations"],
)


@router.post(
    "/",
    response_model=LocationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_location(
    location: LocationCreate,
    db: Session = Depends(get_db),
):
    return LocationService(db).create_location(location)


@router.get(
    "/",
    response_model=list[LocationResponse],
)
def get_locations(
    db: Session = Depends(get_db),
):
    return LocationService(db).get_all_locations()


@router.get(
    "/{location_id}",
    response_model=LocationResponse,
)
def get_location(
    location_id: UUID,
    db: Session = Depends(get_db),
):
    return LocationService(db).get_location(location_id)


@router.put(
    "/{location_id}",
    response_model=LocationResponse,
)
def update_location(
    location_id: UUID,
    location: LocationUpdate,
    db: Session = Depends(get_db),
):
    return LocationService(db).update_location(
        location_id,
        location,
    )


@router.delete(
    "/{location_id}",
)
def delete_location(
    location_id: UUID,
    db: Session = Depends(get_db),
):
    return LocationService(db).delete_location(location_id)