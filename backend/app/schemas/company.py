from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from app.schemas.application import StudentBrief, InternshipBrief


class CompanyProfileOut(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    website: str | None = None
    industry: str | None = None
    registration_no: str | None = None
    location: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    hr_spoc_name: str | None = None
    hr_spoc_email: str | None = None
    hr_spoc_phone: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    logo_url: str | None = None
    verified: bool = False

    class Config:
        from_attributes = True


class CompanyProfileUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    website: str | None = None
    industry: str | None = None
    registration_no: str | None = None
    location: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    hr_spoc_name: str | None = None
    hr_spoc_email: str | None = None
    hr_spoc_phone: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    logo_url: str | None = None


class CompanyApplicantOut(BaseModel):
    id: UUID
    student_id: UUID
    internship_id: UUID
    status: str
    stage: str | None = None
    cover_letter: str | None = None
    ai_match_score: float | None = None
    ai_match_reason: str | None = None
    applied_at: datetime
    reviewed_at: datetime | None = None
    rejection_reason: str | None = None
    student: StudentBrief | None = None
    internship: InternshipBrief | None = None

    class Config:
        from_attributes = True


class CompanyApplicantStatusUpdate(BaseModel):
    status: str  # pending, shortlisted, approved, rejected
    stage: str | None = None
    rejection_reason: str | None = None


class CompanyDashboardStats(BaseModel):
    total_internships: int
    active_internships: int
    total_applicants: int
    active_interns: int
    recent_applicants: list[CompanyApplicantOut]
