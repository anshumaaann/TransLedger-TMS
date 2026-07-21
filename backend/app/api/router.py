from fastapi import APIRouter

from app.api.routes.customer import router as customer_router

api_router = APIRouter()

api_router.include_router(customer_router)