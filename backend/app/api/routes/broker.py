from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session


from app.db.session import get_db


from app.schemas.broker import (
    BrokerCreate,
    BrokerResponse,
    BrokerUpdate,
)


from app.services.broker_service import (
    BrokerService
)



router = APIRouter(

    prefix="/brokers",

    tags=["Brokers"]

)





# Create Broker

@router.post(
    "/",
    response_model=BrokerResponse
)
def create_broker(

    broker: BrokerCreate,

    db: Session = Depends(get_db)

):

    service = BrokerService(db)

    return service.create_broker(
        broker
    )





# Get All Brokers

@router.get(
    "/",
    response_model=list[BrokerResponse]
)
def get_all_brokers(

    db: Session = Depends(get_db)

):

    service = BrokerService(db)

    return service.get_all_brokers()





# Get Broker By ID

@router.get(
    "/{broker_id}",
    response_model=BrokerResponse
)
def get_broker_by_id(

    broker_id: UUID,

    db: Session = Depends(get_db)

):

    service = BrokerService(db)


    broker = service.get_broker_by_id(
        broker_id
    )


    if not broker:

        raise HTTPException(

            status_code=404,

            detail="Broker not found"

        )


    return broker





# Update Broker

@router.put(
    "/{broker_id}",
    response_model=BrokerResponse
)
def update_broker(

    broker_id: UUID,

    broker: BrokerUpdate,

    db: Session = Depends(get_db)

):

    service = BrokerService(db)


    updated = service.update_broker(

        broker_id,

        broker

    )


    if not updated:

        raise HTTPException(

            status_code=404,

            detail="Broker not found"

        )


    return updated





# Delete Broker

@router.delete(
    "/{broker_id}"
)
def delete_broker(

    broker_id: UUID,

    db: Session = Depends(get_db)

):

    service = BrokerService(db)


    deleted = service.delete_broker(
        broker_id
    )


    if not deleted:

        raise HTTPException(

            status_code=404,

            detail="Broker not found"

        )


    return {

        "message":
        "Broker deleted successfully"

    }