from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session


from app.db.session import get_db


from app.schemas.customer import (
    CustomerCreate,
    CustomerResponse,
    CustomerUpdate,
)


from app.services.customer_service import (
    CustomerService
)



router = APIRouter(

    prefix="/customers",

    tags=["Customers"]

)





# Create Customer

@router.post(
    "/",
    response_model=CustomerResponse
)
def create_customer(

    customer: CustomerCreate,

    db: Session = Depends(get_db)

):

    service = CustomerService(db)

    return service.create_customer(
        customer
    )





# Get All Customers

@router.get(
    "/",
    response_model=list[CustomerResponse]
)
def get_all_customers(

    db: Session = Depends(get_db)

):

    service = CustomerService(db)

    return service.get_all_customers()





# Get Customer By ID

@router.get(
    "/{customer_id}",
    response_model=CustomerResponse
)
def get_customer_by_id(

    customer_id: UUID,

    db: Session = Depends(get_db)

):

    service = CustomerService(db)


    customer = service.get_customer_by_id(
        customer_id
    )


    if not customer:

        raise HTTPException(

            status_code=404,

            detail="Customer not found"

        )


    return customer





# Update Customer

@router.put(
    "/{customer_id}",
    response_model=CustomerResponse
)
def update_customer(

    customer_id: UUID,

    customer: CustomerUpdate,

    db: Session = Depends(get_db)

):

    service = CustomerService(db)


    updated = service.update_customer(

        customer_id,

        customer

    )


    if not updated:

        raise HTTPException(

            status_code=404,

            detail="Customer not found"

        )


    return updated





# Delete Customer

@router.delete(
    "/{customer_id}"
)
def delete_customer(

    customer_id: UUID,

    db: Session = Depends(get_db)

):

    service = CustomerService(db)


    deleted = service.delete_customer(
        customer_id
    )


    if not deleted:

        raise HTTPException(

            status_code=404,

            detail="Customer not found"

        )


    return {

        "message":
        "Customer deleted successfully"

    }