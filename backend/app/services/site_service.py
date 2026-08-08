from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.site import Site

from app.repositories.site_repository import (
    SiteRepository
)

from app.schemas.site import (
    SiteCreate,
    SiteUpdate,
)



class SiteService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.site_repo = SiteRepository(
            db
        )



    # Create Site

    def create_site(
        self,
        site_data: SiteCreate
    ):


        existing_site = (

            self.db.query(Site)

            .filter(
                Site.site_name
                ==
                site_data.site_name
            )

            .first()

        )


        if existing_site:

            raise HTTPException(
                status_code=409,
                detail="Site already exists."
            )



        site = Site(
            **site_data.model_dump()
        )


        return self.site_repo.create(
            site
        )



    # Get All Sites

    def get_all_sites(
        self
    ):

        return self.site_repo.get_all()



    # Get Site By ID

    def get_site_by_id(
        self,
        site_id: UUID
    ):

        return self.site_repo.get_by_id(
            site_id
        )



    # Update Site

    def update_site(
        self,
        site_id: UUID,
        site_data: SiteUpdate
    ):


        site = self.site_repo.get_by_id(
            site_id
        )


        if not site:

            return None



        return self.site_repo.update(
            site,
            site_data
        )



    # Delete Site

    def delete_site(
        self,
        site_id: UUID
    ):


        site = self.site_repo.get_by_id(
            site_id
        )


        if not site:

            return None



        return self.site_repo.delete(
            site
        )