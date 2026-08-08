import uuid

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
)



# -------------------------
# Create Booking
# -------------------------

class BookingCreate(BaseModel):

    booking_date: date


    customer_id: uuid.UUID

    broker_id: uuid.UUID

    vehicle_id: uuid.UUID



    # Site References

    loading_site_id: uuid.UUID

    unloading_site_id: uuid.UUID



    bill_to: Optional[str] = None



    weight: Decimal

    freight_type: Optional[str] = None



    # Customer Financials

    customer_freight: Decimal

    customer_advance: Decimal = Decimal("0.00")

    tds_amount: Decimal = Decimal("0.00")



    # Broker Financials

    broker_freight: Decimal

    broker_advance: Decimal = Decimal("0.00")



    # Payment

    payment_method: Optional[str] = None

    bill_submission_status: Optional[str] = None


    payment_received_date: Optional[date] = None


    payment_received_amount: Decimal = Decimal("0.00")



    remarks: Optional[str] = None





# -------------------------
# Update Booking
# -------------------------

class BookingUpdate(BaseModel):

    booking_date: Optional[date] = None



    customer_id: Optional[uuid.UUID] = None

    broker_id: Optional[uuid.UUID] = None

    vehicle_id: Optional[uuid.UUID] = None



    # Site References

    loading_site_id: Optional[uuid.UUID] = None

    unloading_site_id: Optional[uuid.UUID] = None



    bill_to: Optional[str] = None



    weight: Optional[Decimal] = None

    freight_type: Optional[str] = None



    customer_freight: Optional[Decimal] = None

    customer_advance: Optional[Decimal] = None

    tds_amount: Optional[Decimal] = None



    broker_freight: Optional[Decimal] = None

    broker_advance: Optional[Decimal] = None



    payment_method: Optional[str] = None

    bill_submission_status: Optional[str] = None


    payment_received_date: Optional[date] = None


    payment_received_amount: Optional[Decimal] = None



    remarks: Optional[str] = None





# -------------------------
# Response
# -------------------------

class BookingResponse(BaseModel):

    id: uuid.UUID



    booking_number: str

    booking_date: date



    customer_id: uuid.UUID

    broker_id: uuid.UUID

    vehicle_id: uuid.UUID



    # Site References

    loading_site_id: uuid.UUID

    unloading_site_id: uuid.UUID



    bill_to: Optional[str]



    weight: Decimal

    freight_type: Optional[str]



    customer_freight: Decimal

    customer_advance: Decimal

    customer_balance: Decimal

    customer_paid_amount: Decimal

    tds_amount: Decimal

    customer_payment_status: str



    broker_freight: Decimal

    broker_advance: Decimal

    broker_balance: Decimal

    broker_paid_amount: Decimal

    broker_payment_status: str



    payment_method: Optional[str]

    bill_submission_status: Optional[str]



    payment_received_date: Optional[date]

    payment_received_amount: Decimal



    profit: Decimal



    remarks: Optional[str]



    created_at: datetime

    updated_at: datetime



    model_config = ConfigDict(
        from_attributes=True
    )
