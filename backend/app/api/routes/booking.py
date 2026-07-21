from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
)
from app.services.booking_service import BookingService

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"],
)


# ------------------------------------
# Create Booking
# ------------------------------------

@router.post(
    "/",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    return service.create_booking(booking)


# ------------------------------------
# Get All Bookings
# ------------------------------------

@router.get(
    "/",
    response_model=list[BookingResponse],
)
def get_all_bookings(
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    return service.get_all_bookings()


# ------------------------------------
# Get Booking By ID
# ------------------------------------

@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    return service.get_booking(booking_id)


# ------------------------------------
# Update Booking
# ------------------------------------

@router.put(
    "/{booking_id}",
    response_model=BookingResponse,
)
def update_booking(
    booking_id: UUID,
    booking: BookingUpdate,
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    return service.update_booking(
        booking_id,
        booking,
    )


# ------------------------------------
# Delete Booking
# ------------------------------------

@router.delete(
    "/{booking_id}",
)
def delete_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
):
    service = BookingService(db)
    return service.delete_booking(
        booking_id,
    )