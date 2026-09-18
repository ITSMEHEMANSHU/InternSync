import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Text, Integer, Date, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.enums import ReportStatus


class WeeklyReport(Base):
    __tablename__ = "weekly_reports"
    __table_args__ = {"extend_existing": True}

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    assignment_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assignments.id", ondelete="CASCADE"),
        nullable=False,
    )
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    week_number = Column(Integer, nullable=False, default=1)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    summary = Column(Text, nullable=True)
    key_learnings = Column(Text, nullable=True)
    challenges = Column(Text, nullable=True)
    plan_next_week = Column(Text, nullable=True)
    hours_logged = Column(Integer, default=40)

    status = Column(
        ReportStatus,
        nullable=False,
        default="draft",
        server_default=text("'draft'::report_status"),
    )

    ai_match_confidence = Column(Integer, default=95)
    ai_audit_notes = Column(Text, nullable=True)

    submitted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )

    assignment = relationship("Assignment", foreign_keys=[assignment_id], lazy="joined")
    student = relationship("User", foreign_keys=[student_id], lazy="joined")
    feedback_entries = relationship("Feedback", back_populates="weekly_report", cascade="all, delete-orphan", lazy="selectin")
