from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Application
from app.schemas.application import ApplicationOut, RejectPayload
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
    app_row.faculty_approved_by = user["id"]

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
    app_row.faculty_approved_by = user["id"]

    await db.commit()
    await db.refresh(app_row)

    enriched = await _enrich(db, [app_row], include_student=True)
    return enriched[0]