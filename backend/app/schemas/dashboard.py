from decimal import Decimal

from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_bookings: int
    total_customer_revenue: Decimal
    total_broker_cost: Decimal
    total_profit: Decimal
    pending_receivables: Decimal
    pending_payables: Decimal