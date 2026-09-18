import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Feedback(Base):
    __tablename__ = "feedback"
    __table_args__ = {"extend_existing": True}

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    weekly_report_id = Column(
        UUID(as_uuid=True),
        ForeignKey("weekly_reports.id", ondelete="CASCADE"),
        nullable=False,
    )
    author_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    comments = Column(Text, nullable=False)
    rating = Column(Integer, default=8)
    author_type = Column(String(50), default="company_mentor")

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )

    weekly_report = relationship("WeeklyReport", back_populates="feedback_entries")
    author = relationship("User", foreign_keys=[author_id], lazy="joined")
