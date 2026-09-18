from sqlalchemy import (
    String, Text, Numeric, Boolean, Integer, Date, DateTime,
    ForeignKey, ARRAY, text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, date
from uuid import UUID as PyUUID

from app.db.base import Base
from app.models.enums import InternshipStatus


class Internship(Base):
    __tablename__ = "internships"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    company_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id")
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    required_skills: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    duration_months: Mapped[int | None] = mapped_column(Integer)
    stipend: Mapped[float | None] = mapped_column(Numeric(10, 2))
    location: Mapped[str | None] = mapped_column(String)
    remote: Mapped[bool] = mapped_column(Boolean, default=False)
    openings: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(InternshipStatus, default="draft")
    deadline: Mapped[date | None] = mapped_column(Date)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
    )