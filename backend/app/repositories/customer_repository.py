from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


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