from collections import defaultdict
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.broker import Broker
from app.models.customer import Customer
from app.repositories.payment_repository import PaymentRepository


ZERO = Decimal("0.00")


class LedgerService:
    def __init__(self, db: Session):
        self.db = db
        self.payment_repo = PaymentRepository(db)

    @staticmethod
    def _finalise(entries: list[dict], party_type: str) -> list[dict]:
        entries.sort(key=lambda item: (item["entry_date"], item["booking_number"] or "", item["description"]))
        running = ZERO
        for entry in entries:
            if party_type == "customer":
                running += entry["debit"] - entry["credit"]
            else:
                running += entry["credit"] - entry["debit"]
            entry["running_balance"] = running
        return entries

    def customer_ledger(self, customer_id: UUID) -> dict:
        customer = self.db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        bookings = self.db.query(Booking).filter(Booking.customer_id == customer_id).all()
        payments = self.payment_repo.get_for_customer(customer_id)
        payments_by_booking: dict[UUID, list] = defaultdict(list)
        for payment in payments:
            payments_by_booking[payment.booking_id].append(payment)

        entries: list[dict] = []
        for booking in bookings:
            common = {"booking_id": booking.id, "booking_number": booking.booking_number, "payment_id": None}
            entries.append({**common, "entry_date": booking.booking_date, "description": "Freight billed", "debit": Decimal(booking.customer_freight), "credit": ZERO})
            if booking.customer_advance:
                entries.append({**common, "entry_date": booking.booking_date, "description": "Customer advance received", "debit": ZERO, "credit": Decimal(booking.customer_advance)})
            if booking.payment_received_amount:
                entries.append({**common, "entry_date": booking.payment_received_date or booking.booking_date, "description": "Payment recorded on booking", "debit": ZERO, "credit": Decimal(booking.payment_received_amount)})
            payment_tds = sum((Decimal(item.tds_amount) for item in payments_by_booking[booking.id]), ZERO)
            booking_tds = Decimal(booking.tds_amount) - payment_tds
            if booking_tds > ZERO:
                entries.append({**common, "entry_date": booking.booking_date, "description": "TDS deducted on booking", "debit": ZERO, "credit": booking_tds})

        for payment in payments:
            common = {"booking_id": payment.booking_id, "payment_id": payment.id, "booking_number": next((booking.booking_number for booking in bookings if booking.id == payment.booking_id), None)}
            if payment.amount:
                entries.append({**common, "entry_date": payment.payment_date, "description": "Customer payment received", "debit": ZERO, "credit": Decimal(payment.amount)})
            if payment.tds_amount:
                entries.append({**common, "entry_date": payment.payment_date, "description": "TDS deducted from customer payment", "debit": ZERO, "credit": Decimal(payment.tds_amount)})

        final_entries = self._finalise(entries, "customer")
        return {
            "party_id": customer.id,
            "party_name": customer.customer_name,
            "party_type": "customer",
            "outstanding_amount": sum((Decimal(booking.customer_balance) for booking in bookings), ZERO),
            "entries": final_entries,
        }

    def broker_ledger(self, broker_id: UUID) -> dict:
        broker = self.db.query(Broker).filter(Broker.id == broker_id).first()
        if not broker:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Broker not found")
        bookings = self.db.query(Booking).filter(Booking.broker_id == broker_id).all()
        payments = self.payment_repo.get_for_broker(broker_id)
        booking_numbers = {booking.id: booking.booking_number for booking in bookings}

        entries: list[dict] = []
        for booking in bookings:
            common = {"booking_id": booking.id, "booking_number": booking.booking_number, "payment_id": None}
            entries.append({**common, "entry_date": booking.booking_date, "description": "Broker freight payable", "debit": ZERO, "credit": Decimal(booking.broker_freight)})
            if booking.broker_advance:
                entries.append({**common, "entry_date": booking.booking_date, "description": "Broker advance paid", "debit": Decimal(booking.broker_advance), "credit": ZERO})
        for payment in payments:
            entries.append({
                "booking_id": payment.booking_id,
                "payment_id": payment.id,
                "booking_number": booking_numbers.get(payment.booking_id),
                "entry_date": payment.payment_date,
                "description": "Broker payment made",
                "debit": Decimal(payment.amount),
                "credit": ZERO,
            })

        final_entries = self._finalise(entries, "broker")
        return {
            "party_id": broker.id,
            "party_name": broker.broker_name,
            "party_type": "broker",
            "outstanding_amount": sum((Decimal(booking.broker_balance) for booking in bookings), ZERO),
            "entries": final_entries,
        }
