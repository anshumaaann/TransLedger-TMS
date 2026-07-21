from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.location_repository import LocationRepository
from app.schemas.location import (
    LocationCreate,
    LocationUpdate,
)


class LocationService:

    def __init__(self, db: Session):
        self.repo = LocationRepository(db)

    def create_location(self, location_data: LocationCreate):

        existing = self.repo.get_by_name(
            location_data.location_name
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Location already exists."
            )

        return self.repo.create(location_data)

    def get_all_locations(self):
        return self.repo.get_all()

    def get_location(self, location_id: UUID):

        location = self.repo.get_by_id(location_id)

        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found."
            )

        return location

    def update_location(
        self,
        location_id: UUID,
        location_data: LocationUpdate,
    ):

        location = self.repo.get_by_id(location_id)

        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found."
            )

        return self.repo.update(
            location,
            location_data,
        )

    def delete_location(self, location_id: UUID):

        location = self.repo.get_by_id(location_id)

        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Location not found."
            )

        self.repo.delete(location)

        return {
            "message": "Location deleted successfully."
        }