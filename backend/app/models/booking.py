import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # -----------------------------
    # Booking Details
    # -----------------------------
    booking_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    booking_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # -----------------------------
    # Master References
    # -----------------------------
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id"),
        nullable=False,
    )

    broker_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("brokers.id"),
        nullable=False,
    )

    vehicle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("vehicles.id"),
        nullable=False,
    )

    loading_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("locations.id"),
        nullable=False,
    )

    unloading_location_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("locations.id"),
        nullable=False,
    )

    # -----------------------------
    # Transport Details
    # -----------------------------
    bill_to: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    weight: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    freight_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # -----------------------------
    # Customer Financials
    # -----------------------------
    customer_freight: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    customer_advance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    customer_balance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    # -----------------------------
    # Broker Financials
    # -----------------------------
    broker_freight: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    broker_advance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    broker_balance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    # -----------------------------
    # Payment Details
    # -----------------------------
    payment_method: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    bill_submission_status: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    payment_received_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    payment_received_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    # -----------------------------
    # Profit
    # -----------------------------
    profit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
    )

    # -----------------------------
    # Remarks
    # -----------------------------
    remarks: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # -----------------------------
    # Audit Fields
    # -----------------------------
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )