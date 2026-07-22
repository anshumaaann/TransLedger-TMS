from uuid import UUID

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.schemas.booking import BookingUpdate



class BookingRepository:


    def __init__(
        self,
        db: Session
    ):

        self.db = db



    # ---------------------------------
    # Get All Bookings
    # ---------------------------------

    def get_all(self):

        return (

            self.db.query(Booking)

            .order_by(
                Booking.created_at.desc()
            )

            .all()

        )



    # ---------------------------------
    # Get Latest Booking
    # ---------------------------------

    def get_latest(self):

        return (

            self.db.query(Booking)

            .order_by(
                Booking.created_at.desc()
            )

            .first()

        )



    # ---------------------------------
    # Get Booking By ID
    # ---------------------------------

    def get_by_id(
        self,
        booking_id: UUID
    ):

        return (

            self.db.query(Booking)

            .filter(
                Booking.id == booking_id
            )

            .first()

        )



    # ---------------------------------
    # Create Booking
    # ---------------------------------

    def create(
        self,
        booking_data,
        booking_number,
        customer_balance,
        broker_balance,
        profit,
    ):


        booking = Booking(

            booking_number=booking_number,

            booking_date=booking_data.booking_date,


            customer_id=booking_data.customer_id,

            broker_id=booking_data.broker_id,

            vehicle_id=booking_data.vehicle_id,


            loading_location_id=
            booking_data.loading_location_id,


            unloading_location_id=
            booking_data.unloading_location_id,



            bill_to=booking_data.bill_to,


            weight=booking_data.weight,

            freight_type=
            booking_data.freight_type,



            customer_freight=
            booking_data.customer_freight,


            customer_advance=
            booking_data.customer_advance,


            customer_balance=
            customer_balance,



            broker_freight=
            booking_data.broker_freight,


            broker_advance=
            booking_data.broker_advance,


            broker_balance=
            broker_balance,



            payment_method=
            booking_data.payment_method,


            bill_submission_status=
            booking_data.bill_submission_status,


            payment_received_date=
            booking_data.payment_received_date,


            payment_received_amount=
            booking_data.payment_received_amount,



            profit=profit,


            remarks=
            booking_data.remarks,

        )



        self.db.add(booking)

        self.db.commit()

        self.db.refresh(booking)


        return booking



    # ---------------------------------
    # Update Booking
    # ---------------------------------

    def update(
        self,
        booking,
        booking_data: BookingUpdate
    ):


        data = booking_data.model_dump(
            exclude_unset=True
        )


        for key,value in data.items():

            setattr(
                booking,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(booking)


        return booking



    # ---------------------------------
    # Delete Booking
    # ---------------------------------

    def delete(
        self,
        booking
    ):


        self.db.delete(
            booking
        )

        self.db.commit()


        return booking