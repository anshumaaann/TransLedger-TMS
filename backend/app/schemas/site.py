from uuid import UUID

from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
)



# -------------------------
# Create Site
# -------------------------

class SiteCreate(BaseModel):

    site_name: str

    site_type: str | None = None

    address: str | None = None

    city: str | None = None

    state: str | None = None

    pincode: str | None = None

    contact_person: str | None = None

    mobile: str | None = None




# -------------------------
# Update Site
# -------------------------

class SiteUpdate(BaseModel):

    site_name: str | None = None

    site_type: str | None = None

    address: str | None = None

    city: str | None = None

    state: str | None = None

    pincode: str | None = None

    contact_person: str | None = None

    mobile: str | None = None

    is_active: bool | None = None




# -------------------------
# Response
# -------------------------

class SiteResponse(BaseModel):

    id: UUID

    site_name: str

    site_type: str | None

    address: str | None

    city: str | None

    state: str | None

    pincode: str | None

    contact_person: str | None

    mobile: str | None

    is_active: bool

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )