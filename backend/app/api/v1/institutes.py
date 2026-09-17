from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Institute
from app.schemas.institute import InstituteOut, InstituteCreate

router = APIRouter(prefix="/institutes", tags=["institutes"])


@router.get("", response_model=list[InstituteOut])
async def list_institutes(
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Public endpoint to list institutes (used in dropdowns for registration/selection)."""
    stmt = select(Institute).order_by(Institute.name.asc())
    if search:
        stmt = stmt.where(Institute.name.ilike(f"%{search}%"))
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/all", response_model=list[InstituteOut])
async def list_all_institutes(
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("admin")),
):
    stmt = select(Institute).order_by(Institute.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{institute_id}", response_model=InstituteOut)
async def get_institute(
    institute_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Institute).where(Institute.id == institute_id))
    institute = result.scalar_one_or_none()
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")
    return institute


@router.post("", response_model=InstituteOut)
async def create_institute(
    payload: InstituteCreate,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("admin")),
):
    institute = Institute(**payload.model_dump(), created_by=user["id"])
    db.add(institute)
    await db.commit()
    await db.refresh(institute)
    return institute


@router.post("/{institute_id}/verify", response_model=InstituteOut)
async def verify_institute(
    institute_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(Institute).where(Institute.id == institute_id))
    institute = result.scalar_one_or_none()
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")
    institute.verified = True
    institute.verified_at = datetime.now(timezone.utc)
    institute.verified_by = user["id"]
    await db.commit()
    await db.refresh(institute)
    return institute