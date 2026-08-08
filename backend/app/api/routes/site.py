from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.site import (
    SiteCreate,
    SiteResponse,
    SiteUpdate,
)

from app.services.site_service import SiteService



router = APIRouter(
    prefix="/sites",
    tags=["Sites"],
)



# Create Site

@router.post(
    "/",
    response_model=SiteResponse
)
def create_site(
    site: SiteCreate,
    db: Session = Depends(get_db),
):

    service = SiteService(db)

    return service.create_site(
        site
    )



# Get All Sites

@router.get(
    "/",
    response_model=list[SiteResponse]
)
def get_all_sites(
    db: Session = Depends(get_db),
):

    service = SiteService(db)

    return service.get_all_sites()



# Get Site By ID

@router.get(
    "/{site_id}",
    response_model=SiteResponse
)
def get_site_by_id(
    site_id: UUID,
    db: Session = Depends(get_db),
):

    service = SiteService(db)

    site = service.get_site_by_id(
        site_id
    )


    if not site:

        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )


    return site



# Update Site

@router.put(
    "/{site_id}",
    response_model=SiteResponse
)
def update_site(
    site_id: UUID,
    site: SiteUpdate,
    db: Session = Depends(get_db),
):

    service = SiteService(db)

    updated = service.update_site(
        site_id,
        site
    )


    if not updated:

        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )


    return updated



# Delete Site

@router.delete(
    "/{site_id}"
)
def delete_site(
    site_id: UUID,
    db: Session = Depends(get_db),
):

    service = SiteService(db)

    deleted = service.delete_site(
        site_id
    )


    if not deleted:

        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )


    return {
        "message": "Site deleted successfully"
    }