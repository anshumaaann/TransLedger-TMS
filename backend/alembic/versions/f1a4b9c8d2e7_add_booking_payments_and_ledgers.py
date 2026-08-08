"""add booking payments and settlement fields

Revision ID: f1a4b9c8d2e7
Revises: d7a6f9c1e4b2
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f1a4b9c8d2e7"
down_revision: Union[str, Sequence[str], None] = "d7a6f9c1e4b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bookings", sa.Column("customer_paid_amount", sa.Numeric(12, 2), nullable=False, server_default="0"))
    op.add_column("bookings", sa.Column("tds_amount", sa.Numeric(12, 2), nullable=False, server_default="0"))
    op.add_column("bookings", sa.Column("customer_payment_status", sa.String(length=20), nullable=False, server_default="pending"))
    op.add_column("bookings", sa.Column("broker_paid_amount", sa.Numeric(12, 2), nullable=False, server_default="0"))
    op.add_column("bookings", sa.Column("broker_payment_status", sa.String(length=20), nullable=False, server_default="pending"))
    op.create_table(
        "payments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("booking_id", sa.UUID(), nullable=False),
        sa.Column("customer_id", sa.UUID(), nullable=True),
        sa.Column("broker_id", sa.UUID(), nullable=True),
        sa.Column("party_type", sa.String(length=20), nullable=False),
        sa.Column("payment_date", sa.Date(), nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("tds_amount", sa.Numeric(12, 2), nullable=False, server_default="0"),
        sa.Column("payment_method", sa.String(length=50), nullable=True),
        sa.Column("reference_number", sa.String(length=100), nullable=True),
        sa.Column("remarks", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["broker_id"], ["brokers.id"]),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_payments_booking_id", "payments", ["booking_id"])
    op.create_index("ix_payments_customer_id", "payments", ["customer_id"])
    op.create_index("ix_payments_broker_id", "payments", ["broker_id"])
    op.create_index("ix_payments_party_type", "payments", ["party_type"])


def downgrade() -> None:
    op.drop_index("ix_payments_party_type", table_name="payments")
    op.drop_index("ix_payments_broker_id", table_name="payments")
    op.drop_index("ix_payments_customer_id", table_name="payments")
    op.drop_index("ix_payments_booking_id", table_name="payments")
    op.drop_table("payments")
    op.drop_column("bookings", "broker_payment_status")
    op.drop_column("bookings", "broker_paid_amount")
    op.drop_column("bookings", "customer_payment_status")
    op.drop_column("bookings", "tds_amount")
    op.drop_column("bookings", "customer_paid_amount")
