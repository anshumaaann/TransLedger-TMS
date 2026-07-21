from uuid import UUID

from sqlalchemy.orm import Session

from app.models.location import Location
from app.schemas.location import LocationCreate, LocationUpdate


class LocationRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, location_data: LocationCreate):

        location = Location(**location_data.model_dump())

        self.db.add(location)
        self.db.commit()
        self.db.refresh(location)

        return location

    def get_all(self):

        return (
            self.db.query(Location)
            .order_by(Location.location_name)
            .all()
        )

    def get_by_id(self, location_id: UUID):

        return (
            self.db.query(Location)
            .filter(Location.id == location_id)
            .first()
        )

    def get_by_name(self, location_name: str):

        return (
            self.db.query(Location)
            .filter(Location.location_name == location_name)
            .first()
        )

    def update(
        self,
        location: Location,
        location_data: LocationUpdate,
    ):

        update_data = location_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(location, key, value)

        self.db.commit()
        self.db.refresh(location)

        return location

    def delete(self, location: Location):

        location.is_active = False

        self.db.commit()
        self.db.refresh(location)

        return location