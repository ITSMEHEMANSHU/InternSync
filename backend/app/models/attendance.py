import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Numeric, Date, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.enums import AttendanceStatus


class Attendance(Base):
    __tablename__ = "attendance"
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

    date = Column(Date, nullable=False)
    status = Column(
        AttendanceStatus,
        nullable=False,
        default="present",
        server_default=text("'present'::attendance_status"),
    )
    hours = Column(Numeric(4, 2), default=8.0)
    notes = Column(String(500), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )

    assignment = relationship("Assignment", foreign_keys=[assignment_id], lazy="joined")
    student = relationship("User", foreign_keys=[student_id], lazy="joined")
