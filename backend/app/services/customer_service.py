from sqlalchemy.orm import Session

from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate
from app.models.customer import Customer


class CustomerService:

    @staticmethod
    def create_customer(db: Session, customer: CustomerCreate) -> Customer:
        return CustomerRepository.create(db, customer)