from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.booking_repository import BookingRepository
from app.repositories.broker_repository import BrokerRepository
from app.repositories.customer_repository import CustomerRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.site_repository import SiteRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.booking import BookingCreate, BookingUpdate


ZERO = Decimal("0.00")


class BookingService:
    def __init__(self, db: Session):
        self.db = db
        self.booking_repo = BookingRepository(db)
        self.customer_repo = CustomerRepository(db)
        self.broker_repo = BrokerRepository(db)
        self.vehicle_repo = VehicleRepository(db)
        self.site_repo = SiteRepository(db)
        self.payment_repo = PaymentRepository(db)

    def _generate_booking_number(self) -> str:
        year = datetime.now().year
        latest = self.booking_repo.get_latest()
        if not latest:
            return f"BK-{year}-000001"
        try:
            number = int(latest.booking_number.split("-")[-1]) + 1
        except (AttributeError, ValueError):
            number = 1
        return f"BK-{year}-{number:06d}"

    @staticmethod
    def _payment_status(freight: Decimal, balance: Decimal) -> str:
        if balance <= ZERO:
            return "paid"
        if balance < freight:
            return "partial"
        return "pending"

    @staticmethod
    def calculate_financials(
        customer_freight: Decimal,
        customer_advance: Decimal,
        payment_received_amount: Decimal,
        customer_paid_amount: Decimal,
        tds_amount: Decimal,
        broker_freight: Decimal,
        broker_advance: Decimal,
        broker_paid_amount: Decimal,
    ) -> dict[str, Decimal | str]:
        customer_balance = customer_freight - customer_advance - payment_received_amount - customer_paid_amount - tds_amount
        broker_balance = broker_freight - broker_advance - broker_paid_amount
        return {
            "customer_balance": customer_balance,
            "broker_balance": broker_balance,
            "profit": customer_freight - broker_freight,
            "customer_payment_status": BookingService._payment_status(customer_freight, customer_balance),
            "broker_payment_status": BookingService._payment_status(broker_freight, broker_balance),
        }

    @staticmethod
    def _ensure_valid_amounts(financials: dict[str, Decimal | str]) -> None:
        if Decimal(financials["customer_balance"]) < ZERO:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Customer payments and TDS cannot be more than customer freight")
        if Decimal(financials["broker_balance"]) < ZERO:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Broker payments cannot be more than broker freight")

    def _validate_references(self, customer_id: UUID, broker_id: UUID, vehicle_id: UUID, loading_site_id: UUID, unloading_site_id: UUID) -> None:
        checks = (
            (self.customer_repo.get_by_id(customer_id), "Customer not found"),
            (self.broker_repo.get_by_id(broker_id), "Broker not found"),
            (self.vehicle_repo.get_by_id(vehicle_id), "Vehicle not found"),
            (self.site_repo.get_by_id(loading_site_id), "Loading site not found"),
            (self.site_repo.get_by_id(unloading_site_id), "Unloading site not found"),
        )
        for record, message in checks:
            if not record:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)

    def create_booking(self, booking_data: BookingCreate):
        self._validate_references(
            booking_data.customer_id,
            booking_data.broker_id,
            booking_data.vehicle_id,
            booking_data.loading_site_id,
            booking_data.unloading_site_id,
        )
        financials = self.calculate_financials(
            booking_data.customer_freight,
            booking_data.customer_advance,
            booking_data.payment_received_amount,
            ZERO,
            booking_data.tds_amount,
            booking_data.broker_freight,
            booking_data.broker_advance,
            ZERO,
        )
        self._ensure_valid_amounts(financials)
        return self.booking_repo.create(
            booking_data=booking_data,
            booking_number=self._generate_booking_number(),
            customer_balance=financials["customer_balance"],
            broker_balance=financials["broker_balance"],
            profit=financials["profit"],
            customer_payment_status=financials["customer_payment_status"],
            broker_payment_status=financials["broker_payment_status"],
        )

    def get_all_bookings(self):
        return self.booking_repo.get_all()

    def get_booking(self, booking_id: UUID):
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        return booking

    def update_booking(self, booking_id: UUID, booking_data: BookingUpdate):
        booking = self.get_booking(booking_id)
        updated = booking_data.model_dump(exclude_unset=True)
        # Validate master records only when one was changed.
        if any(key in updated for key in ("customer_id", "broker_id", "vehicle_id", "loading_site_id", "unloading_site_id")):
            self._validate_references(
                updated.get("customer_id", booking.customer_id),
                updated.get("broker_id", booking.broker_id),
                updated.get("vehicle_id", booking.vehicle_id),
                updated.get("loading_site_id", booking.loading_site_id),
                updated.get("unloading_site_id", booking.unloading_site_id),
            )
        financials = self.calculate_financials(
            Decimal(updated.get("customer_freight", booking.customer_freight)),
            Decimal(updated.get("customer_advance", booking.customer_advance)),
            Decimal(updated.get("payment_received_amount", booking.payment_received_amount)),
            Decimal(booking.customer_paid_amount),
            Decimal(updated.get("tds_amount", booking.tds_amount)),
            Decimal(updated.get("broker_freight", booking.broker_freight)),
            Decimal(updated.get("broker_advance", booking.broker_advance)),
            Decimal(booking.broker_paid_amount),
        )
        self._ensure_valid_amounts(financials)
        for key, value in financials.items():
            setattr(booking, key, value)
        return self.booking_repo.update(booking, booking_data)

    def delete_booking(self, booking_id: UUID):
        booking = self.get_booking(booking_id)
        if self.payment_repo.has_for_booking(booking_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This booking has payment records. Delete those payment records first to keep the ledgers accurate.",
            )
        self.booking_repo.delete(booking)
        return {"message": "Booking deleted successfully"}
