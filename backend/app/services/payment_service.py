from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment import PaymentCreate
from app.services.booking_service import BookingService, ZERO


class PaymentService:
    def __init__(self, db: Session):
        self.db = db
        self.booking_repo = BookingRepository(db)
        self.payment_repo = PaymentRepository(db)

    @staticmethod
    def _apply_booking_financials(booking) -> None:
        financials = BookingService.calculate_financials(
            Decimal(booking.customer_freight),
            Decimal(booking.customer_advance),
            Decimal(booking.payment_received_amount),
            Decimal(booking.customer_paid_amount),
            Decimal(booking.tds_amount),
            Decimal(booking.broker_freight),
            Decimal(booking.broker_advance),
            Decimal(booking.broker_paid_amount),
        )
        BookingService._ensure_valid_amounts(financials)
        for key, value in financials.items():
            setattr(booking, key, value)

    def create_payment(self, payment_data: PaymentCreate):
        booking = self.booking_repo.get_by_id(payment_data.booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        amount = Decimal(payment_data.amount)
        tds_amount = Decimal(payment_data.tds_amount)
        if payment_data.party_type == "broker" and tds_amount != ZERO:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="TDS can only be recorded against a customer payment")
        settlement = amount + tds_amount
        if settlement <= ZERO:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Enter a payment amount or TDS amount")

        if payment_data.party_type == "customer":
            if settlement > Decimal(booking.customer_balance):
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Payment and TDS are more than the customer amount pending on this booking")
            booking.customer_paid_amount = Decimal(booking.customer_paid_amount) + amount
            booking.tds_amount = Decimal(booking.tds_amount) + tds_amount
            customer_id = booking.customer_id
            broker_id = None
        else:
            if amount > Decimal(booking.broker_balance):
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Payment is more than the broker amount pending on this booking")
            booking.broker_paid_amount = Decimal(booking.broker_paid_amount) + amount
            customer_id = None
            broker_id = booking.broker_id

        self._apply_booking_financials(booking)
        payment = Payment(
            booking_id=booking.id,
            customer_id=customer_id,
            broker_id=broker_id,
            party_type=payment_data.party_type,
            payment_date=payment_data.payment_date,
            amount=amount,
            tds_amount=tds_amount,
            payment_method=payment_data.payment_method,
            reference_number=payment_data.reference_number,
            remarks=payment_data.remarks,
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def get_all_payments(self, booking_id: UUID | None = None, party_type: str | None = None):
        return self.payment_repo.get_all(booking_id=booking_id, party_type=party_type)

    def delete_payment(self, payment_id: UUID):
        payment = self.payment_repo.get_by_id(payment_id)
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
        booking = self.booking_repo.get_by_id(payment.booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="The related booking is unavailable")

        if payment.party_type == "customer":
            booking.customer_paid_amount = Decimal(booking.customer_paid_amount) - Decimal(payment.amount)
            booking.tds_amount = Decimal(booking.tds_amount) - Decimal(payment.tds_amount)
        else:
            booking.broker_paid_amount = Decimal(booking.broker_paid_amount) - Decimal(payment.amount)
        self._apply_booking_financials(booking)
        self.db.delete(payment)
        self.db.commit()
        return {"message": "Payment deleted and booking balance restored"}
