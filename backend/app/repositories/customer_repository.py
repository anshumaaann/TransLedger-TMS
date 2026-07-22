from uuid import UUID

from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.schemas.customer import CustomerUpdate


class CustomerRepository:


    def __init__(
        self,
        db: Session
    ):
        self.db = db



    # Get All Customers

    def get_all(self):

        return (
            self.db.query(Customer)
            .filter(
                Customer.is_active == True
            )
            .order_by(
                Customer.created_at.desc()
            )
            .all()
        )



    # Get Customer By ID

    def get_by_id(
        self,
        customer_id: UUID
    ):

        return (
            self.db.query(Customer)
            .filter(
                Customer.id == customer_id,
                Customer.is_active == True
            )
            .first()
        )



    # Create Customer

    def create(
        self,
        customer
    ):

        self.db.add(customer)

        self.db.commit()

        self.db.refresh(customer)

        return customer



    # Update Customer

    def update(
        self,
        customer,
        customer_data: CustomerUpdate
    ):

        data = customer_data.model_dump(
            exclude_unset=True
        )


        for key,value in data.items():

            setattr(
                customer,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(customer)

        return customer



    # Soft Delete

    def delete(
        self,
        customer
    ):

        customer.is_active = False

        self.db.commit()

        return customer