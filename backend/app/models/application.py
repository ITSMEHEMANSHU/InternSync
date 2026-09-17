from sqlalchemy import (
    String, Text, Numeric, DateTime, ForeignKey, UniqueConstraint, text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from uuid import UUID as PyUUID

from app.db.base import Base
from app.models.enums import ApplicationStatus


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint(
            "student_id", "internship_id",
            name="applications_student_id_internship_id_key",
        ),
    )

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    student_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id")
    )
    internship_id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("internships.id")
    )
    status: Mapped[str] = mapped_column(ApplicationStatus, default="pending")
    stage: Mapped[str | None] = mapped_column(String, default="applied")
    cover_letter: Mapped[str | None] = mapped_column(Text)
    ai_match_score: Mapped[float | None] = mapped_column(Numeric(5, 2))
    ai_match_reason: Mapped[str | None] = mapped_column(Text)
    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    reviewed_by: Mapped[PyUUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id")
    )
    faculty_approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    faculty_approved_by: Mapped[PyUUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id")
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text)