from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.customer import Customer

from app.repositories.customer_repository import (
    CustomerRepository
)

from app.schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
)



class CustomerService:


    def __init__(
        self,
        db: Session
    ):

        self.db = db

        self.customer_repo = CustomerRepository(
            db
        )



    # Create Customer

    def create_customer(
        self,
        customer: CustomerCreate
    ):


        existing_customer = (

            self.db.query(Customer)

            .filter(
                Customer.customer_code
                ==
                customer.customer_code
            )

            .first()

        )


        if existing_customer:

            raise HTTPException(

                status_code=409,

                detail=
                "Customer code already exists."

            )



        customer_model = Customer(

            **customer.model_dump()

        )


        return self.customer_repo.create(
            customer_model
        )



    # Get All Customers

    def get_all_customers(self):

        return self.customer_repo.get_all()



    # Get Customer By ID

    def get_customer_by_id(
        self,
        customer_id: UUID
    ):

        return self.customer_repo.get_by_id(
            customer_id
        )



    # Update Customer

    def update_customer(
        self,
        customer_id: UUID,
        customer_data: CustomerUpdate
    ):


        customer = (

            self.customer_repo.get_by_id(
                customer_id
            )

        )


        if not customer:

            return None



        return self.customer_repo.update(

            customer,

            customer_data

        )



    # Delete Customer

    def delete_customer(
        self,
        customer_id: UUID
    ):


        customer = (

            self.customer_repo.get_by_id(
                customer_id
            )

        )


        if not customer:

            return None



        return self.customer_repo.delete(
            customer
        )