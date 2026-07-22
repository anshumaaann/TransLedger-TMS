from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session


from app.db.session import get_db


from app.schemas.location import (
    LocationCreate,
    LocationResponse,
    LocationUpdate,
)


from app.services.location_service import (
    LocationService
)



router = APIRouter(

    prefix="/locations",

    tags=["Locations"]

)





# ---------------------------------
# Create Location
# ---------------------------------

@router.post(
    "/",
    response_model=LocationResponse
)
def create_location(

    location: LocationCreate,

    db: Session = Depends(get_db)

):

    service = LocationService(db)

    return service.create_location(
        location
    )





# ---------------------------------
# Get All Locations
# ---------------------------------

@router.get(
    "/",
    response_model=list[LocationResponse]
)
def get_all_locations(

    db: Session = Depends(get_db)

):

    service = LocationService(db)

    return service.get_all_locations()





# ---------------------------------
# Get Location By ID
# ---------------------------------

@router.get(
    "/{location_id}",
    response_model=LocationResponse
)
def get_location_by_id(

    location_id: UUID,

    db: Session = Depends(get_db)

):

    service = LocationService(db)


    location = service.get_location_by_id(
        location_id
    )


    if not location:

        raise HTTPException(

            status_code=404,

            detail="Location not found"

        )


    return location





# ---------------------------------
# Update Location
# ---------------------------------

@router.put(
    "/{location_id}",
    response_model=LocationResponse
)
def update_location(

    location_id: UUID,

    location: LocationUpdate,

    db: Session = Depends(get_db)

):

    service = LocationService(db)


    updated = service.update_location(

        location_id,

        location

    )


    if not updated:

        raise HTTPException(

            status_code=404,

            detail="Location not found"

        )


    return updated





# ---------------------------------
# Delete Location
# ---------------------------------

@router.delete(
    "/{location_id}"
)
def delete_location(

    location_id: UUID,

    db: Session = Depends(get_db)

):

    service = LocationService(db)


    deleted = service.delete_location(
        location_id
    )


    if not deleted:

        raise HTTPException(

            status_code=404,

            detail="Location not found"

        )


    return {

        "message":
        "Location deleted successfully"

    }