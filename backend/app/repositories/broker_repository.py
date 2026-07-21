from uuid import UUID

from sqlalchemy.orm import Session

from app.models.broker import Broker
from app.schemas.broker import BrokerCreate, BrokerUpdate


class BrokerRepository:

    @staticmethod
    def create(db: Session, broker: BrokerCreate) -> Broker:
        db_broker = Broker(
            broker_code=broker.broker_code,
            broker_name=broker.broker_name,
            contact_person=broker.contact_person,
            mobile=broker.mobile,
            email=broker.email,
            address=broker.address,
        )

        db.add(db_broker)
        db.commit()
        db.refresh(db_broker)

        return db_broker

    @staticmethod
    def get_by_code(
        db: Session,
        broker_code: str,
    ) -> Broker | None:
        return (
            db.query(Broker)
            .filter(
                Broker.broker_code == broker_code,
                Broker.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def get_all(db: Session) -> list[Broker]:
        return (
            db.query(Broker)
            .filter(Broker.is_active.is_(True))
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        broker_id: UUID,
    ) -> Broker | None:
        return (
            db.query(Broker)
            .filter(
                Broker.id == broker_id,
                Broker.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        broker_id: UUID,
        broker: BrokerUpdate,
    ) -> Broker | None:

        db_broker = (
            db.query(Broker)
            .filter(
                Broker.id == broker_id,
                Broker.is_active.is_(True),
            )
            .first()
        )

        if db_broker is None:
            return None

        db_broker.broker_name = broker.broker_name
        db_broker.contact_person = broker.contact_person
        db_broker.mobile = broker.mobile
        db_broker.email = broker.email
        db_broker.address = broker.address

        db.commit()
        db.refresh(db_broker)

        return db_broker

    @staticmethod
    def delete(
        db: Session,
        broker_id: UUID,
    ) -> Broker | None:

        db_broker = (
            db.query(Broker)
            .filter(
                Broker.id == broker_id,
                Broker.is_active.is_(True),
            )
            .first()
        )

        if db_broker is None:
            return None

        db_broker.is_active = False

        db.commit()
        db.refresh(db_broker)

        return db_broker