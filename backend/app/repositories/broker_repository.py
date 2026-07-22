from uuid import UUID

from sqlalchemy.orm import Session

from app.models.broker import Broker
from app.schemas.broker import BrokerUpdate


class BrokerRepository:


    def __init__(
        self,
        db: Session
    ):
        self.db = db



    def get_all(self):

        return (
            self.db.query(Broker)
            .filter(
                Broker.is_active == True
            )
            .order_by(
                Broker.created_at.desc()
            )
            .all()
        )



    def get_by_id(
        self,
        broker_id: UUID
    ):

        return (
            self.db.query(Broker)
            .filter(
                Broker.id == broker_id,
                Broker.is_active == True
            )
            .first()
        )



    def create(
        self,
        broker
    ):

        self.db.add(broker)

        self.db.commit()

        self.db.refresh(broker)

        return broker



    def update(
        self,
        broker,
        broker_data: BrokerUpdate
    ):

        data = broker_data.model_dump(
            exclude_unset=True
        )


        for key,value in data.items():

            setattr(
                broker,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(broker)

        return broker



    def delete(
        self,
        broker
    ):

        broker.is_active = False

        self.db.commit()

        return broker