from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services.payment_service import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=list[PaymentResponse])
def get_all_payments(booking_id: UUID | None = None, party_type: str | None = None, db: Session = Depends(get_db)):
    return PaymentService(db).get_all_payments(booking_id=booking_id, party_type=party_type)


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    return PaymentService(db).create_payment(payment)


@router.delete("/{payment_id}")
def delete_payment(payment_id: UUID, db: Session = Depends(get_db)):
    return PaymentService(db).delete_payment(payment_id)
