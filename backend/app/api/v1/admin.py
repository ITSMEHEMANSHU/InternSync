from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import User, Role, Company, Institute

router = APIRouter(prefix="/admin", tags=["admin"])


# ---------- USERS ----------
@router.get("/users")
async def list_users(
    role: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("admin")),
):
    stmt = (
        select(User, Role.code, Institute.name)
        .join(Role, Role.id == User.role_id, isouter=True)
        .join(Institute, Institute.id == User.institute_id, isouter=True)
        .order_by(User.created_at.desc())
    )
    if role:
        stmt = stmt.where(Role.code == role)
    if status:
        stmt = stmt.where(User.status == status)

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "id": str(u.id),
            "email": u.email,
            "name": u.name,
            "role": role_code or "student",
            "status": u.status,
            "is_super_admin": u.is_super_admin,
            "institute": institute_name,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "approved_at": u.approved_at.isoformat() if u.approved_at else None,
        }
        for (u, role_code, institute_name) in rows
    ]


@router.post("/users/{user_id}/approve")
async def approve_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(User).where(User.id == user_id))
    u = result.scalar_one_or_none()
    if not u:
        raise HTTPException(404, "User not found")
    if u.status == "active":
        raise HTTPException(400, "User already active")

    u.status = "active"
    u.approved_at = datetime.now(timezone.utc)
    u.approved_by = admin["id"]
    await db.commit()
    await db.refresh(u)

    return {"id": str(u.id), "status": u.status, "message": "Approved"}


@router.post("/users/{user_id}/reject")
async def reject_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(User).where(User.id == user_id))
    u = result.scalar_one_or_none()
    if not u:
        raise HTTPException(404, "User not found")

    u.status = "suspended"
    u.rejection_reason = "Rejected by admin"
    await db.commit()
    await db.refresh(u)

    return {"id": str(u.id), "status": u.status, "message": "Rejected"}


# ---------- COMPANIES ----------
@router.get("/companies")
async def list_companies(
    verified: bool | None = None,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("admin")),
):
    stmt = select(Company).order_by(Company.created_at.desc())
    if verified is not None:
        stmt = stmt.where(Company.verified == verified)

    result = await db.execute(stmt)
    companies = result.scalars().all()

    return [
        {
            "id": str(c.id),
            "name": c.name,
            "industry": c.industry,
            "location": c.location,
            "website": c.website,
            "contact_email": c.contact_email,
            "hr_spoc_name": c.hr_spoc_name,
            "hr_spoc_email": c.hr_spoc_email,
            "hr_spoc_phone": c.hr_spoc_phone,
            "verified": c.verified,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in companies
    ]


@router.post("/companies/{company_id}/verify")
async def verify_company(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Company not found")

    c.verified = True
    c.verified_at = datetime.now(timezone.utc)
    c.verified_by = admin["id"]

    # Also activate the HR SPOC user account
    if c.hr_spoc_user_id:
        user_result = await db.execute(
            select(User).where(User.id == c.hr_spoc_user_id)
        )
        hr_user = user_result.scalar_one_or_none()
        if hr_user and hr_user.status != "active":
            hr_user.status = "active"
            hr_user.approved_at = datetime.now(timezone.utc)
            hr_user.approved_by = admin["id"]

    await db.commit()
    await db.refresh(c)
    return {"id": str(c.id), "verified": c.verified, "message": "Verified"}


@router.post("/companies/{company_id}/reject")
async def reject_company(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Company not found")

    c.verified = False

    # Suspend the HR SPOC user
    if c.hr_spoc_user_id:
        user_result = await db.execute(
            select(User).where(User.id == c.hr_spoc_user_id)
        )
        hr_user = user_result.scalar_one_or_none()
        if hr_user:
            hr_user.status = "suspended"
            hr_user.rejection_reason = "Company rejected by admin"

    await db.commit()
    return {"id": str(c.id), "verified": False, "message": "Rejected"}