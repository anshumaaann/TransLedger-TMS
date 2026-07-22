from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.booking_repository import BookingRepository
from app.repositories.customer_repository import CustomerRepository
from app.repositories.broker_repository import BrokerRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.location_repository import LocationRepository

from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
)


class BookingService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.booking_repo = BookingRepository(db)

        self.customer_repo = CustomerRepository(db)

        self.broker_repo = BrokerRepository(db)

        self.vehicle_repo = VehicleRepository(db)

        self.location_repo = LocationRepository(db)



    # ---------------------------------
    # Generate Booking Number
    # ---------------------------------

    def _generate_booking_number(self) -> str:


        year = datetime.now().year


        latest_booking = (
            self.booking_repo.get_latest()
        )


        if not latest_booking:

            return f"BK-{year}-000001"



        latest_number = (
            latest_booking.booking_number
        )


        try:

            sequence = int(
                latest_number.split("-")[-1]
            ) + 1


        except Exception:

            sequence = 1



        return (
            f"BK-{year}-{sequence:06d}"
        )



    # ---------------------------------
    # Create Booking
    # ---------------------------------

    def create_booking(
        self,
        booking_data: BookingCreate
    ):


        # Validate Customer

        customer = (
            self.customer_repo.get_by_id(
                booking_data.customer_id
            )
        )


        if not customer:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Customer not found."

            )



        # Validate Broker

        broker = (
            self.broker_repo.get_by_id(
                booking_data.broker_id
            )
        )


        if not broker:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Broker not found."

            )



        # Validate Vehicle

        vehicle = (
            self.vehicle_repo.get_by_id(
                booking_data.vehicle_id
            )
        )


        if not vehicle:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Vehicle not found."

            )



        # Validate Loading Location

        loading_location = (
            self.location_repo.get_by_id(
                booking_data.loading_location_id
            )
        )


        if not loading_location:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Loading location not found."

            )



        # Validate Unloading Location

        unloading_location = (
            self.location_repo.get_by_id(
                booking_data.unloading_location_id
            )
        )


        if not unloading_location:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Unloading location not found."

            )



        # Financial Calculations

        customer_balance = (

            booking_data.customer_freight

            -

            booking_data.customer_advance

        )



        broker_balance = (

            booking_data.broker_freight

            -

            booking_data.broker_advance

        )



        profit = (

            booking_data.customer_freight

            -

            booking_data.broker_freight

        )



        booking_number = (
            self._generate_booking_number()
        )



        return self.booking_repo.create(

            booking_data=booking_data,

            booking_number=booking_number,

            customer_balance=customer_balance,

            broker_balance=broker_balance,

            profit=profit,

        )



    # ---------------------------------
    # Get All Bookings
    # ---------------------------------

    def get_all_bookings(self):

        return (
            self.booking_repo.get_all()
        )



    # ---------------------------------
    # Get Booking By ID
    # ---------------------------------

    def get_booking(
        self,
        booking_id: UUID
    ):


        booking = (

            self.booking_repo.get_by_id(
                booking_id
            )

        )


        if not booking:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Booking not found."

            )


        return booking



    # ---------------------------------
    # Update Booking
    # ---------------------------------

    def update_booking(
        self,
        booking_id: UUID,
        booking_data: BookingUpdate,
    ):


        booking = (

            self.booking_repo.get_by_id(
                booking_id
            )

        )


        if not booking:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Booking not found."

            )



        updated_data = (
            booking_data.model_dump(
                exclude_unset=True
            )
        )



        customer_freight = Decimal(

            updated_data.get(

                "customer_freight",

                booking.customer_freight

            )

        )



        customer_advance = Decimal(

            updated_data.get(

                "customer_advance",

                booking.customer_advance

            )

        )



        broker_freight = Decimal(

            updated_data.get(

                "broker_freight",

                booking.broker_freight

            )

        )



        broker_advance = Decimal(

            updated_data.get(

                "broker_advance",

                booking.broker_advance

            )

        )



        booking.customer_balance = (

            customer_freight

            -

            customer_advance

        )



        booking.broker_balance = (

            broker_freight

            -

            broker_advance

        )



        booking.profit = (

            customer_freight

            -

            broker_freight

        )



        return self.booking_repo.update(

            booking,

            booking_data

        )



    # ---------------------------------
    # Delete Booking
    # ---------------------------------

    def delete_booking(
        self,
        booking_id: UUID
    ):


        booking = (

            self.booking_repo.get_by_id(
                booking_id
            )

        )


        if not booking:

            raise HTTPException(

                status_code=status.HTTP_404_NOT_FOUND,

                detail="Booking not found."

            )



        self.booking_repo.delete(
            booking
        )


        return {

            "message":
            "Booking deleted successfully."

        }