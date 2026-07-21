from uuid import UUID

from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleRepository:

    @staticmethod
    def create(db: Session, vehicle: VehicleCreate) -> Vehicle:
        db_vehicle = Vehicle(
            vehicle_number=vehicle.vehicle_number,
            vehicle_type=vehicle.vehicle_type,
            owner_name=vehicle.owner_name,
            mobile=vehicle.mobile,
            capacity=vehicle.capacity,
        )

        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)

        return db_vehicle

    @staticmethod
    def get_by_number(
        db: Session,
        vehicle_number: str,
    ) -> Vehicle | None:
        return (
            db.query(Vehicle)
            .filter(
                Vehicle.vehicle_number == vehicle_number,
                Vehicle.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def get_all(db: Session) -> list[Vehicle]:
        return (
            db.query(Vehicle)
            .filter(Vehicle.is_active.is_(True))
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        vehicle_id: UUID,
    ) -> Vehicle | None:
        return (
            db.query(Vehicle)
            .filter(
                Vehicle.id == vehicle_id,
                Vehicle.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        vehicle_id: UUID,
        vehicle: VehicleUpdate,
    ) -> Vehicle | None:

        db_vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == vehicle_id,
                Vehicle.is_active.is_(True),
            )
            .first()
        )

        if db_vehicle is None:
            return None

        db_vehicle.vehicle_type = vehicle.vehicle_type
        db_vehicle.owner_name = vehicle.owner_name
        db_vehicle.mobile = vehicle.mobile
        db_vehicle.capacity = vehicle.capacity

        db.commit()
        db.refresh(db_vehicle)

        return db_vehicle

    @staticmethod
    def delete(
        db: Session,
        vehicle_id: UUID,
    ) -> Vehicle | None:

        db_vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == vehicle_id,
                Vehicle.is_active.is_(True),
            )
            .first()
        )

        if db_vehicle is None:
            return None

        db_vehicle.is_active = False

        db.commit()
        db.refresh(db_vehicle)

        return db_vehicle