from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.booking import Booking


class DashboardService:

    def __init__(self, db: Session):
        self.db = db

    def get_dashboard(self):

        total_bookings = self.db.query(Booking).count()

        revenue = (
            self.db.query(
                func.coalesce(func.sum(Booking.customer_freight), 0)
            ).scalar()
        )

        broker_cost = (
            self.db.query(
                func.coalesce(func.sum(Booking.broker_freight), 0)
            ).scalar()
        )

        profit = (
            self.db.query(
                func.coalesce(func.sum(Booking.profit), 0)
            ).scalar()
        )

        receivable = (
            self.db.query(
                func.coalesce(func.sum(Booking.customer_balance), 0)
            ).scalar()
        )

        payable = (
            self.db.query(
                func.coalesce(func.sum(Booking.broker_balance), 0)
            ).scalar()
        )

        return {
            "total_bookings": total_bookings,
            "total_customer_revenue": revenue,
            "total_broker_cost": broker_cost,
            "total_profit": profit,
            "pending_receivables": receivable,
            "pending_payables": payable,
        }