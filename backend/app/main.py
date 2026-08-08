from fastapi import Depends, FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware


from app.api.routes import (
    customer,
    broker,
    vehicle,
    location,
    site,
    booking,
    dashboard,
    auth,
    payment,
    ledger,
)
from app.api.deps import require_roles
from app.core.config import settings
from app.db.database import engine



app = FastAPI(

    title=settings.APP_NAME,

    version=settings.APP_VERSION,

    description="Transportation Management System Backend",

)





# ---------------------------------
# CORS
# ---------------------------------

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173",

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)





# ---------------------------------
# API ROUTES
# ---------------------------------

app.include_router(auth.router)


app.include_router(

    customer.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)


app.include_router(

    broker.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)


app.include_router(

    vehicle.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)


# Temporary old module

app.include_router(

    location.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)



# Site Master

app.include_router(

    site.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)



app.include_router(

    booking.router,
    dependencies=[Depends(require_roles("admin", "dispatcher"))],

)


# Payments and party ledgers

app.include_router(

    payment.router,
    dependencies=[Depends(require_roles("admin", "dispatcher", "accountant"))],

)


app.include_router(

    ledger.router,
    dependencies=[Depends(require_roles("admin", "dispatcher", "accountant", "viewer"))],

)



# Dashboard

app.include_router(

    dashboard.router,
    dependencies=[Depends(require_roles("admin", "dispatcher", "accountant", "viewer"))],

)







# ---------------------------------
# Health Check
# ---------------------------------

@app.get("/")

def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "database": "connected",
        "status": "healthy",
    }
