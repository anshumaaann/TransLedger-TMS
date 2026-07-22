from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle

from app.repositories.vehicle_repository import (
    VehicleRepository
)

from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
)



class VehicleService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.vehicle_repo = VehicleRepository(
            db
        )



    # ---------------------------------
    # Create Vehicle
    # ---------------------------------

    def create_vehicle(
        self,
        vehicle_data: VehicleCreate
    ):


        existing_vehicle = (

            self.db.query(Vehicle)

            .filter(
                Vehicle.vehicle_number
                ==
                vehicle_data.vehicle_number
            )

            .first()

        )


        if existing_vehicle:

            raise HTTPException(

                status_code=409,

                detail="Vehicle number already exists."

            )



        vehicle = Vehicle(

            **vehicle_data.model_dump()

        )


        return self.vehicle_repo.create(
            vehicle
        )



    # ---------------------------------
    # Get All Vehicles
    # ---------------------------------

    def get_all_vehicles(self):

        return self.vehicle_repo.get_all()



    # ---------------------------------
    # Get Vehicle By ID
    # ---------------------------------

    def get_vehicle_by_id(
        self,
        vehicle_id: UUID
    ):

        return self.vehicle_repo.get_by_id(
            vehicle_id
        )



    # ---------------------------------
    # Update Vehicle
    # ---------------------------------

    def update_vehicle(
        self,
        vehicle_id: UUID,
        vehicle_data: VehicleUpdate
    ):


        vehicle = (

            self.vehicle_repo.get_by_id(
                vehicle_id
            )

        )


        if not vehicle:

            return None



        return self.vehicle_repo.update(

            vehicle,

            vehicle_data

        )



    # ---------------------------------
    # Delete Vehicle
    # ---------------------------------

    def delete_vehicle(
        self,
        vehicle_id: UUID
    ):


        vehicle = (

            self.vehicle_repo.get_by_id(
                vehicle_id
            )

        )


        if not vehicle:

            return None



        return self.vehicle_repo.delete(
            vehicle
        )