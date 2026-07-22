from uuid import UUID

from sqlalchemy.orm import Session

from app.models.location import Location
from app.schemas.location import LocationUpdate


class LocationRepository:


    def __init__(
        self,
        db: Session
    ):
        self.db = db



    def get_all(self):

        return (
            self.db.query(Location)
            .filter(
                Location.is_active == True
            )
            .order_by(
                Location.created_at.desc()
            )
            .all()
        )



    def get_by_id(
        self,
        location_id: UUID
    ):

        return (
            self.db.query(Location)
            .filter(
                Location.id == location_id,
                Location.is_active == True
            )
            .first()
        )



    def create(
        self,
        location
    ):

        self.db.add(location)

        self.db.commit()

        self.db.refresh(location)

        return location



    def update(
        self,
        location,
        location_data: LocationUpdate
    ):

        data = location_data.model_dump(
            exclude_unset=True
        )


        for key,value in data.items():

            setattr(
                location,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(location)

        return location



    def delete(
        self,
        location
    ):

        location.is_active = False

        self.db.commit()

        return location