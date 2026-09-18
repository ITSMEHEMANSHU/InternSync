from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import Optional

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models import Internship, Company
from app.schemas.internship import InternshipOut

router = APIRouter(prefix="/internships", tags=["internships"])

@router.get("", response_model=list[InternshipOut])
async def list_internships(
    search: Optional[str] = Query(None),
    remote: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    stmt = (
        select(Internship)
        .where(Internship.status == "open")
        .order_by(Internship.created_at.desc())
    )
    if search:
        stmt = stmt.where(Internship.title.ilike(f"%{search}%"))
    if remote is not None:
        stmt = stmt.where(Internship.remote == remote)

    result = await db.execute(stmt)
    internships = result.scalars().all()

    company_ids = list({i.company_id for i in internships})
    companies = {}
    if company_ids:
        comp_result = await db.execute(
            select(Company).where(Company.id.in_(company_ids))
        )
        companies = {c.id: c for c in comp_result.scalars().all()}

    return [
        InternshipOut(
            id=i.id,
            title=i.title,
            description=i.description,
            required_skills=i.required_skills or [],
            duration_months=i.duration_months,
            stipend=float(i.stipend) if i.stipend else None,
            location=i.location,
            remote=i.remote,
            openings=i.openings,
            status=i.status,
            deadline=i.deadline,
            company=companies.get(i.company_id),
        )
        for i in internships
    ]

@router.get("/{internship_id}", response_model=InternshipOut)
async def get_internship(
    internship_id: str,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(Internship).where(Internship.id == internship_id)
    )
    internship = result.scalar_one_or_none()
    if not internship:
        from fastapi import HTTPException
        raise HTTPException(404, "Internship not found")

    comp_result = await db.execute(
        select(Company).where(Company.id == internship.company_id)
    )
    company = comp_result.scalar_one_or_none()

    return InternshipOut(
        id=internship.id,
        title=internship.title,
        description=internship.description,
        required_skills=internship.required_skills or [],
        duration_months=internship.duration_months,
        stipend=float(internship.stipend) if internship.stipend else None,
        location=internship.location,
        remote=internship.remote,
        openings=internship.openings,
        status=internship.status,
        deadline=internship.deadline,
        company=company,
    )