from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate, CustomerUpdate


class CustomerService:

    @staticmethod
    def create_customer(
        db: Session,
        customer: CustomerCreate,
    ) -> Customer:

        existing_customer = CustomerRepository.get_by_code(
            db,
            customer.customer_code,
        )

        if existing_customer:
            raise HTTPException(
                status_code=409,
                detail=f"Customer code '{customer.customer_code}' already exists.",
            )

        return CustomerRepository.create(db, customer)

    @staticmethod
    def get_all_customers(db: Session) -> list[Customer]:
        return CustomerRepository.get_all(db)

    @staticmethod
    def get_customer_by_id(
        db: Session,
        customer_id: UUID,
    ) -> Customer | None:
        return CustomerRepository.get_by_id(db, customer_id)

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: UUID,
        customer: CustomerUpdate,
    ) -> Customer | None:
        return CustomerRepository.update(
            db,
            customer_id,
            customer,
        )

    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: UUID,
    ) -> Customer | None:
        return CustomerRepository.delete(
            db,
            customer_id,
        )