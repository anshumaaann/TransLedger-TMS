from uuid import UUID

from sqlalchemy.orm import Session

from app.models.site import Site

from app.schemas.site import SiteUpdate



class SiteRepository:


    def __init__(
        self,
        db: Session
    ):

        self.db = db



    # ---------------------------------
    # Get All Sites
    # ---------------------------------

    def get_all(self):

        return (

            self.db.query(Site)

            .filter(
                Site.is_active == True
            )

            .order_by(
                Site.created_at.desc()
            )

            .all()

        )



    # ---------------------------------
    # Get Site By ID
    # ---------------------------------

    def get_by_id(
        self,
        site_id: UUID
    ):

        return (

            self.db.query(Site)

            .filter(
                Site.id == site_id,
                Site.is_active == True
            )

            .first()

        )



    # ---------------------------------
    # Create Site
    # ---------------------------------

    def create(
        self,
        site: Site
    ):

        self.db.add(site)

        self.db.commit()

        self.db.refresh(site)

        return site



    # ---------------------------------
    # Update Site
    # ---------------------------------

    def update(
        self,
        site: Site,
        site_data: SiteUpdate
    ):


        data = site_data.model_dump(
            exclude_unset=True
        )


        for key, value in data.items():

            setattr(
                site,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(site)


        return site



    # ---------------------------------
    # Soft Delete Site
    # ---------------------------------

    def delete(
        self,
        site: Site
    ):


        site.is_active = False


        self.db.commit()


        return site