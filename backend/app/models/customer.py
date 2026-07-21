import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    customer_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
    )

    customer_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        index=True,
    )

    short_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    gst_number: Mapped[str | None] = mapped_column(
        String(15),
        nullable=True,
    )

    contact_person: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    mobile: Mapped[str | None] = mapped_column(
        String(15),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )