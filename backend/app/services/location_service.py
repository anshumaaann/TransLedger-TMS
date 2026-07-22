from uuid import UUID

from sqlalchemy.orm import Session

from app.models.location import Location

from app.repositories.location_repository import (
    LocationRepository
)

from app.schemas.location import (
    LocationCreate,
    LocationUpdate,
)



class LocationService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.location_repo = LocationRepository(
            db
        )



    # ---------------------------------
    # Create Location
    # ---------------------------------

    def create_location(
        self,
        location_data: LocationCreate
    ):


        location = Location(

            **location_data.model_dump()

        )


        return self.location_repo.create(
            location
        )



    # ---------------------------------
    # Get All Locations
    # ---------------------------------

    def get_all_locations(self):

        return self.location_repo.get_all()



    # ---------------------------------
    # Get Location By ID
    # ---------------------------------

    def get_location_by_id(
        self,
        location_id: UUID
    ):

        return self.location_repo.get_by_id(
            location_id
        )



    # ---------------------------------
    # Update Location
    # ---------------------------------

    def update_location(
        self,
        location_id: UUID,
        location_data: LocationUpdate
    ):


        location = (

            self.location_repo.get_by_id(
                location_id
            )

        )


        if not location:

            return None



        return self.location_repo.update(

            location,

            location_data

        )



    # ---------------------------------
    # Delete Location
    # ---------------------------------

    def delete_location(
        self,
        location_id: UUID
    ):


        location = (

            self.location_repo.get_by_id(
                location_id
            )

        )


        if not location:

            return None



        return self.location_repo.delete(
            location
        )