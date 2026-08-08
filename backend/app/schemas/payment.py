import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    booking_id: uuid.UUID
    party_type: Literal["customer", "broker"]
    payment_date: date
    amount: Decimal = Field(default=Decimal("0.00"), ge=0)
    tds_amount: Decimal = Field(default=Decimal("0.00"), ge=0)
    payment_method: str | None = None
    reference_number: str | None = None
    remarks: str | None = None


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    booking_id: uuid.UUID
    customer_id: uuid.UUID | None
    broker_id: uuid.UUID | None
    party_type: str
    payment_date: date
    amount: Decimal
    tds_amount: Decimal
    payment_method: str | None
    reference_number: str | None
    remarks: str | None
    created_at: datetime


class LedgerEntry(BaseModel):
    entry_date: date
    booking_id: uuid.UUID | None = None
    payment_id: uuid.UUID | None = None
    booking_number: str | None = None
    description: str
    debit: Decimal
    credit: Decimal
    running_balance: Decimal


class LedgerResponse(BaseModel):
    party_id: uuid.UUID
    party_name: str
    party_type: Literal["customer", "broker"]
    outstanding_amount: Decimal
    entries: list[LedgerEntry]
