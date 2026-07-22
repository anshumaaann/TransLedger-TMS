from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.broker import Broker

from app.repositories.broker_repository import (
    BrokerRepository
)

from app.schemas.broker import (
    BrokerCreate,
    BrokerUpdate,
)



class BrokerService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.broker_repo = BrokerRepository(
            db
        )



    # ---------------------------------
    # Create Broker
    # ---------------------------------

    def create_broker(
        self,
        broker_data: BrokerCreate
    ):


        existing_broker = (

            self.db.query(Broker)

            .filter(
                Broker.broker_code
                ==
                broker_data.broker_code
            )

            .first()

        )


        if existing_broker:

            raise HTTPException(

                status_code=409,

                detail="Broker code already exists."

            )



        broker = Broker(

            **broker_data.model_dump()

        )


        return self.broker_repo.create(
            broker
        )



    # ---------------------------------
    # Get All Brokers
    # ---------------------------------

    def get_all_brokers(self):

        return self.broker_repo.get_all()



    # ---------------------------------
    # Get Broker By ID
    # ---------------------------------

    def get_broker_by_id(
        self,
        broker_id: UUID
    ):

        return self.broker_repo.get_by_id(
            broker_id
        )



    # ---------------------------------
    # Update Broker
    # ---------------------------------

    def update_broker(
        self,
        broker_id: UUID,
        broker_data: BrokerUpdate
    ):


        broker = (

            self.broker_repo.get_by_id(
                broker_id
            )

        )


        if not broker:

            return None



        return self.broker_repo.update(

            broker,

            broker_data

        )



    # ---------------------------------
    # Delete Broker
    # ---------------------------------

    def delete_broker(
        self,
        broker_id: UUID
    ):


        broker = (

            self.broker_repo.get_by_id(
                broker_id
            )

        )


        if not broker:

            return None



        return self.broker_repo.delete(
            broker
        )