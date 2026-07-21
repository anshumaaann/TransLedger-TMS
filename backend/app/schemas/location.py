import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# -------------------------
# Create
# -------------------------

class LocationCreate(BaseModel):
    location_name: str
    state: Optional[str] = None


# -------------------------
# Update
# -------------------------

class LocationUpdate(BaseModel):
    location_name: Optional[str] = None
    state: Optional[str] = None
    is_active: Optional[bool] = None


# -------------------------
# Response
# -------------------------

class LocationResponse(BaseModel):
    id: uuid.UUID

    location_name: str
    state: Optional[str]

    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)