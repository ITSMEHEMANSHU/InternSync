from sqlalchemy import String, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from uuid import UUID as PyUUID

from app.db.base import Base


class Institute(Base):
    __tablename__ = "institutes"

    id: Mapped[PyUUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    code: Mapped[str | None] = mapped_column(String)
    address: Mapped[str | None] = mapped_column(String)
    city: Mapped[str | None] = mapped_column(String)
    state: Mapped[str | None] = mapped_column(String)
    pincode: Mapped[str | None] = mapped_column(String)
    website: Mapped[str | None] = mapped_column(String)
    contact_email: Mapped[str | None] = mapped_column(String)
    contact_phone: Mapped[str | None] = mapped_column(String)
    logo_url: Mapped[str | None] = mapped_column(String)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    verified_by: Mapped[PyUUID | None] = mapped_column(UUID(as_uuid=True))
    created_by: Mapped[PyUUID | None] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"),
    )