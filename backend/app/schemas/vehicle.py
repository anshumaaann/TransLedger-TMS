from uuid import UUID

from pydantic import BaseModel, ConfigDict


class VehicleCreate(BaseModel):
    vehicle_number: str
    vehicle_type: str
    owner_name: str | None = None
    mobile: str | None = None
    capacity: str | None = None


class VehicleUpdate(BaseModel):
    vehicle_type: str
    owner_name: str | None = None
    mobile: str | None = None
    capacity: str | None = None


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    vehicle_number: str
    vehicle_type: str
    owner_name: str | None
    mobile: str | None
    capacity: str | None
    is_active: bool