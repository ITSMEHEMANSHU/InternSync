from sqlalchemy import String, Text, Boolean, DateTime, Integer, Numeric, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from uuid import UUID as PyUUID

from app.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[PyUUID | None] = mapped_column(UUID(as_uuid=True))
    hr_spoc_user_id: Mapped[PyUUID | None] = mapped_column(UUID(as_uuid=True))
    hr_spoc_name: Mapped[str | None] = mapped_column(String)
    hr_spoc_email: Mapped[str | None] = mapped_column(String)
    hr_spoc_phone: Mapped[str | None] = mapped_column(String)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String)
    industry: Mapped[str | None] = mapped_column(String)
    registration_no: Mapped[str | None] = mapped_column(String)
    location: Mapped[str | None] = mapped_column(String)
    city: Mapped[str | None] = mapped_column(String)
    state: Mapped[str | None] = mapped_column(String)
    pincode: Mapped[str | None] = mapped_column(String)
    contact_email: Mapped[str | None] = mapped_column(String)
    contact_phone: Mapped[str | None] = mapped_column(String)
    logo_url: Mapped[str | None] = mapped_column(String)
    geofence_lat: Mapped[float | None] = mapped_column(Numeric(10, 7))
    geofence_lng: Mapped[float | None] = mapped_column(Numeric(10, 7))
    geofence_radius_m: Mapped[int | None] = mapped_column(Integer, default=200)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    verified_by: Mapped[PyUUID | None] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"),
    )