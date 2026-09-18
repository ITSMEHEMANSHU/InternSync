from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class InstituteBase(BaseModel):
    name: str
    code: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    website: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    logo_url: str | None = None

class InstituteCreate(InstituteBase):
    pass

class InstituteOut(InstituteBase):
    id: UUID
    verified: bool = False
    verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
