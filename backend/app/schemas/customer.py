from pydantic import BaseModel, ConfigDict, EmailStr
from uuid import UUID


class CustomerCreate(BaseModel):
    customer_code: str
    customer_name: str
    short_name: str

    gst_number: str | None = None
    contact_person: str | None = None
    mobile: str | None = None
    email: EmailStr | None = None
    address: str | None = None


class CustomerResponse(CustomerCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_active: bool