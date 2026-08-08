from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment import Payment


class PaymentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, booking_id: UUID | None = None, party_type: str | None = None):
        query = self.db.query(Payment)
        if booking_id:
            query = query.filter(Payment.booking_id == booking_id)
        if party_type:
            query = query.filter(Payment.party_type == party_type)
        return query.order_by(Payment.payment_date.desc(), Payment.created_at.desc()).all()

    def get_by_id(self, payment_id: UUID):
        return self.db.query(Payment).filter(Payment.id == payment_id).first()

    def get_for_customer(self, customer_id: UUID):
        return self.db.query(Payment).filter(Payment.customer_id == customer_id).order_by(Payment.payment_date, Payment.created_at).all()

    def get_for_broker(self, broker_id: UUID):
        return self.db.query(Payment).filter(Payment.broker_id == broker_id).order_by(Payment.payment_date, Payment.created_at).all()

    def has_for_booking(self, booking_id: UUID) -> bool:
        return self.db.query(Payment.id).filter(Payment.booking_id == booking_id).first() is not None
