from fastapi import APIRouter

from app.api.routes.customer import router as customer_router
from app.api.routes.broker import router as broker_router
from app.api.routes.vehicle import router as vehicle_router
from app.api.routes.location import router as location_router
from app.api.routes.booking import router as booking_router
from app.api.routes.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(customer_router)
api_router.include_router(broker_router)
api_router.include_router(vehicle_router)
api_router.include_router(location_router)
api_router.include_router(booking_router)
api_router.include_router(dashboard_router)