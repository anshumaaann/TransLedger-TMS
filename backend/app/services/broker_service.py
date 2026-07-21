from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.broker import Broker
from app.repositories.broker_repository import BrokerRepository
from app.schemas.broker import BrokerCreate, BrokerUpdate


class BrokerService:

    @staticmethod
    def create_broker(
        db: Session,
        broker: BrokerCreate,
    ) -> Broker:

        existing_broker = BrokerRepository.get_by_code(
            db,
            broker.broker_code,
        )

        if existing_broker:
            raise HTTPException(
                status_code=409,
                detail=f"Broker code '{broker.broker_code}' already exists.",
            )

        return BrokerRepository.create(db, broker)

    @staticmethod
    def get_all_brokers(db: Session) -> list[Broker]:
        return BrokerRepository.get_all(db)

    @staticmethod
    def get_broker_by_id(
        db: Session,
        broker_id: UUID,
    ) -> Broker | None:
        return BrokerRepository.get_by_id(db, broker_id)

    @staticmethod
    def update_broker(
        db: Session,
        broker_id: UUID,
        broker: BrokerUpdate,
    ) -> Broker | None:
        return BrokerRepository.update(
            db,
            broker_id,
            broker,
        )

    @staticmethod
    def delete_broker(
        db: Session,
        broker_id: UUID,
    ) -> Broker | None:
        return BrokerRepository.delete(
            db,
            broker_id,
        )