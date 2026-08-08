import uuid

from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    Boolean,
    DateTime,
    func,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base



class Site(Base):

    __tablename__ = "sites"



    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )



    # -------------------------
    # Site Details
    # -------------------------

    site_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )


    site_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )



    # -------------------------
    # Address
    # -------------------------

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )


    city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    state: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    pincode: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )



    # -------------------------
    # Contact
    # -------------------------

    contact_person: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )


    mobile: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )



    # -------------------------
    # Status
    # -------------------------

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )



    # -------------------------
    # Audit
    # -------------------------

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )


    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )