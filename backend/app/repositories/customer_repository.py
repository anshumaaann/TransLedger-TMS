from uuid import UUID

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate


class CustomerRepository:

    @staticmethod
    def create(db: Session, customer: CustomerCreate) -> Customer:
        db_customer = Customer(
            customer_code=customer.customer_code,
            customer_name=customer.customer_name,
            short_name=customer.short_name,
            gst_number=customer.gst_number,
            contact_person=customer.contact_person,
            mobile=customer.mobile,
            email=customer.email,
            address=customer.address,
        )

        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)

        return db_customer

    @staticmethod
    def get_by_code(
        db: Session,
        customer_code: str,
    ) -> Customer | None:
        return (
            db.query(Customer)
            .filter(
                Customer.customer_code == customer_code,
                Customer.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def get_all(db: Session) -> list[Customer]:
        return (
            db.query(Customer)
            .filter(Customer.is_active.is_(True))
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        customer_id: UUID,
    ) -> Customer | None:
        return (
            db.query(Customer)
            .filter(
                Customer.id == customer_id,
                Customer.is_active.is_(True),
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        customer_id: UUID,
        customer: CustomerUpdate,
    ) -> Customer | None:

        db_customer = (
            db.query(Customer)
            .filter(
                Customer.id == customer_id,
                Customer.is_active.is_(True),
            )
            .first()
        )

        if db_customer is None:
            return None

        db_customer.customer_name = customer.customer_name
        db_customer.short_name = customer.short_name
        db_customer.gst_number = customer.gst_number
        db_customer.contact_person = customer.contact_person
        db_customer.mobile = customer.mobile
        db_customer.email = customer.email
        db_customer.address = customer.address

        db.commit()
        db.refresh(db_customer)

        return db_customer

    @staticmethod
    def delete(
        db: Session,
        customer_id: UUID,
    ) -> Customer | None:

        db_customer = (
            db.query(Customer)
            .filter(
                Customer.id == customer_id,
                Customer.is_active.is_(True),
            )
            .first()
        )

        if db_customer is None:
            return None

        db_customer.is_active = False

        db.commit()
        db.refresh(db_customer)

        return db_customer