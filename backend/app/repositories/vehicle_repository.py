from uuid import UUID

from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleUpdate


class VehicleRepository:


    def __init__(
        self,
        db: Session
    ):
        self.db = db



    def get_all(self):

        return (
            self.db.query(Vehicle)
            .filter(
                Vehicle.is_active == True
            )
            .order_by(
                Vehicle.created_at.desc()
            )
            .all()
        )



    def get_by_id(
        self,
        vehicle_id: UUID
    ):

        return (
            self.db.query(Vehicle)
            .filter(
                Vehicle.id == vehicle_id,
                Vehicle.is_active == True
            )
            .first()
        )



    def create(
        self,
        vehicle
    ):

        self.db.add(vehicle)

        self.db.commit()

        self.db.refresh(vehicle)

        return vehicle



    def update(
        self,
        vehicle,
        vehicle_data: VehicleUpdate
    ):

        data = vehicle_data.model_dump(
            exclude_unset=True
        )


        for key,value in data.items():

            setattr(
                vehicle,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(vehicle)

        return vehicle



    def delete(
        self,
        vehicle
    ):

        vehicle.is_active = False

        self.db.commit()

        return vehicle