from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session


from app.db.session import get_db


from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)


from app.services.vehicle_service import (
    VehicleService
)



router = APIRouter(

    prefix="/vehicles",

    tags=["Vehicles"]

)





# ---------------------------------
# Create Vehicle
# ---------------------------------

@router.post(
    "/",
    response_model=VehicleResponse
)
def create_vehicle(

    vehicle: VehicleCreate,

    db: Session = Depends(get_db)

):

    service = VehicleService(db)

    return service.create_vehicle(
        vehicle
    )





# ---------------------------------
# Get All Vehicles
# ---------------------------------

@router.get(
    "/",
    response_model=list[VehicleResponse]
)
def get_all_vehicles(

    db: Session = Depends(get_db)

):

    service = VehicleService(db)

    return service.get_all_vehicles()





# ---------------------------------
# Get Vehicle By ID
# ---------------------------------

@router.get(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def get_vehicle_by_id(

    vehicle_id: UUID,

    db: Session = Depends(get_db)

):

    service = VehicleService(db)


    vehicle = service.get_vehicle_by_id(
        vehicle_id
    )


    if not vehicle:

        raise HTTPException(

            status_code=404,

            detail="Vehicle not found"

        )


    return vehicle





# ---------------------------------
# Update Vehicle
# ---------------------------------

@router.put(
    "/{vehicle_id}",
    response_model=VehicleResponse
)
def update_vehicle(

    vehicle_id: UUID,

    vehicle: VehicleUpdate,

    db: Session = Depends(get_db)

):

    service = VehicleService(db)


    updated = service.update_vehicle(

        vehicle_id,

        vehicle

    )


    if not updated:

        raise HTTPException(

            status_code=404,

            detail="Vehicle not found"

        )


    return updated





# ---------------------------------
# Delete Vehicle
# ---------------------------------

@router.delete(
    "/{vehicle_id}"
)
def delete_vehicle(

    vehicle_id: UUID,

    db: Session = Depends(get_db)

):

    service = VehicleService(db)


    deleted = service.delete_vehicle(
        vehicle_id
    )


    if not deleted:

        raise HTTPException(

            status_code=404,

            detail="Vehicle not found"

        )


    return {

        "message":
        "Vehicle deleted successfully"

    }