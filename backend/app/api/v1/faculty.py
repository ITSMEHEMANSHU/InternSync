from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Application, Internship, Company
from app.schemas.application import ApplicationOut, RejectPayload
from app.schemas.internship import InternshipOut
from app.api.v1.applications import _enrich

router = APIRouter(prefix="/faculty", tags=["faculty"])


@router.get("/applications", response_model=list[ApplicationOut])
async def faculty_pending_applications(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """All applications awaiting faculty review (status=pending)."""
    result = await db.execute(
        select(Application)
        .where(Application.status == "pending")
        .order_by(Application.applied_at.asc())
    )
    apps = result.scalars().all()
    return await _enrich(db, apps, include_student=True)


@router.get("/applications/all", response_model=list[ApplicationOut])
async def faculty_all_applications(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Full history — pending, under_review, shortlisted, approved, rejected."""
    result = await db.execute(
        select(Application)
        .order_by(Application.applied_at.desc())
    )
    apps = result.scalars().all()
    return await _enrich(db, apps, include_student=True)


@router.get("/applications/{application_id}", response_model=ApplicationOut)
async def faculty_application_detail(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


@router.post("/applications/{application_id}/approve", response_model=ApplicationOut)
async def faculty_approve(
    application_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")
    if app_row.status != "pending":
        raise HTTPException(400, f"Cannot approve application with status '{app_row.status}'")

    app_row.status = "under_review"
    app_row.stage = "faculty_approved"
    app_row.faculty_approved_at = datetime.now(timezone.utc)
    try:
        app_row.faculty_approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        app_row.faculty_approved_by = None

    await db.commit()
    await db.refresh(app_row)

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


@router.post("/applications/{application_id}/reject", response_model=ApplicationOut)
async def faculty_reject(
    application_id: UUID,
    payload: RejectPayload,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    result = await db.execute(
        select(Application).where(Application.id == application_id)
    )
    app_row = result.scalar_one_or_none()
    if not app_row:
        raise HTTPException(404, "Application not found")
    if app_row.status not in ("pending", "under_review"):
        raise HTTPException(400, f"Cannot reject application with status '{app_row.status}'")

    app_row.status = "rejected"
    app_row.stage = "faculty_rejected"
    app_row.rejection_reason = payload.reason or "Rejected by faculty"
    app_row.faculty_approved_at = datetime.now(timezone.utc)
    try:
        app_row.faculty_approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        app_row.faculty_approved_by = None

    await db.commit()
    await db.refresh(app_row)

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]


# ============================================================
# INTERNSHIP POSTING APPROVALS BY FACULTY / ADMIN
# ============================================================

def _to_internship_out(i: Internship, company: Company | None) -> InternshipOut:
    return InternshipOut(
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
        start_date=i.start_date,
        end_date=i.end_date,
        approved_at=i.approved_at,
        rejection_reason=i.rejection_reason,
        company=company,
    )


@router.get("/internship-approvals", response_model=list[InternshipOut])
async def list_pending_internships(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """List all internship postings pending approval."""
    result = await db.execute(
        select(Internship)
        .where(Internship.status == "pending_approval")
        .order_by(Internship.created_at.asc())
    )
    internships = result.scalars().all()
    if not internships:
        return []

    company_ids = list({i.company_id for i in internships})
    comp_result = await db.execute(
        select(Company).where(Company.id.in_(company_ids))
    )
    companies = {c.id: c for c in comp_result.scalars().all()}

    return [_to_internship_out(i, companies.get(i.company_id)) for i in internships]


@router.post("/internship-approvals/{internship_id}/approve", response_model=InternshipOut)
async def approve_internship_posting(
    internship_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Approve a pending internship posting to make it OPEN for students."""
    result = await db.execute(
        select(Internship).where(Internship.id == internship_id)
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship posting not found")

    i.status = "open"
    i.rejection_reason = None
    i.approved_at = datetime.now(timezone.utc)
    try:
        i.approved_by = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    except Exception:
        i.approved_by = None

    await db.commit()
    await db.refresh(i)

    comp_result = await db.execute(
        select(Company).where(Company.id == i.company_id)
    )
    company = comp_result.scalar_one_or_none()
    return _to_internship_out(i, company)


@router.post("/internship-approvals/{internship_id}/reject", response_model=InternshipOut)
async def reject_internship_posting(
    internship_id: UUID,
    payload: RejectPayload,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty", "admin")),
):
    """Reject a pending internship posting with an optional reason."""
    result = await db.execute(
        select(Internship).where(Internship.id == internship_id)
    )
    i = result.scalar_one_or_none()
    if not i:
        raise HTTPException(404, "Internship posting not found")

    i.status = "rejected"
    i.rejection_reason = payload.reason or "Rejected by faculty review"
    i.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(i)

    comp_result = await db.execute(
        select(Company).where(Company.id == i.company_id)
    )
    company = comp_result.scalar_one_or_none()
    return _to_internship_out(i, company)