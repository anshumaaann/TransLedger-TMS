from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.payment import LedgerResponse
from app.services.ledger_service import LedgerService

router = APIRouter(prefix="/ledgers", tags=["Ledgers"])


@router.get("/customers/{customer_id}", response_model=LedgerResponse)
def get_customer_ledger(customer_id: UUID, db: Session = Depends(get_db)):
    return LedgerService(db).customer_ledger(customer_id)


@router.get("/brokers/{broker_id}", response_model=LedgerResponse)
def get_broker_ledger(broker_id: UUID, db: Session = Depends(get_db)):
    return LedgerService(db).broker_ledger(broker_id)
