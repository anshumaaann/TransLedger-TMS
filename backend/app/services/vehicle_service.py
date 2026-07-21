from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleService:

    @staticmethod
    def create_vehicle(
        db: Session,
        vehicle: VehicleCreate,
    ) -> Vehicle:

        existing_vehicle = VehicleRepository.get_by_number(
            db,
            vehicle.vehicle_number,
        )

        if existing_vehicle:
            raise HTTPException(
                status_code=409,
                detail=f"Vehicle '{vehicle.vehicle_number}' already exists.",
            )

        return VehicleRepository.create(db, vehicle)

    @staticmethod
    def get_all_vehicles(db: Session) -> list[Vehicle]:
        return VehicleRepository.get_all(db)

    @staticmethod
    def get_vehicle_by_id(
        db: Session,
        vehicle_id: UUID,
    ) -> Vehicle | None:
        return VehicleRepository.get_by_id(db, vehicle_id)

    @staticmethod
    def update_vehicle(
        db: Session,
        vehicle_id: UUID,
        vehicle: VehicleUpdate,
    ) -> Vehicle | None:
        return VehicleRepository.update(
            db,
            vehicle_id,
            vehicle,
        )

    @staticmethod
    def delete_vehicle(
        db: Session,
        vehicle_id: UUID,
    ) -> Vehicle | None:
        return VehicleRepository.delete(
            db,
            vehicle_id,
        )