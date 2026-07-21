from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict


class BrokerCreate(BaseModel):
    broker_code: str
    broker_name: str
    contact_person: str | None = None
    mobile: str | None = None
    email: EmailStr | None = None
    address: str | None = None


class BrokerUpdate(BaseModel):
    broker_name: str
    contact_person: str | None = None
    mobile: str | None = None
    email: EmailStr | None = None
    address: str | None = None


class BrokerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    broker_code: str
    broker_name: str
    contact_person: str | None
    mobile: str | None
    email: EmailStr | None
    address: str | None
    is_active: bool