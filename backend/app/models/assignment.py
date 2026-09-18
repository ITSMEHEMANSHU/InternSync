import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.enums import AssignmentStatus


class Assignment(Base):
    __tablename__ = "assignments"
    __table_args__ = {"extend_existing": True}

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    application_id = Column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
    )
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
    )
    internship_id = Column(
        UUID(as_uuid=True),
        ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False,
    )

    status = Column(
        AssignmentStatus,
        nullable=False,
        default="pending_joining",
        server_default=text("'pending_joining'::assignment_status"),
    )

    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    joining_date = Column(Date, nullable=True)
    joining_letter_url = Column(String(500), nullable=True)

    company_mentor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    faculty_mentor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    joining_verified_company = Column(Boolean, default=False, nullable=False)
    joining_verified_faculty = Column(Boolean, default=False, nullable=False)

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

    # Relationships
    application = relationship("Application", foreign_keys=[application_id], lazy="joined")
    student = relationship("User", foreign_keys=[student_id], lazy="joined")
    company = relationship("Company", foreign_keys=[company_id], lazy="joined")
    internship = relationship("Internship", foreign_keys=[internship_id], lazy="joined")
