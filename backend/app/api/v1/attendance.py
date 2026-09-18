from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, extract, and_
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, date, timezone

from app.db.session import get_db
from app.core.deps import require_role
from app.models import Attendance, Assignment
from app.schemas.attendance import AttendanceOut, AttendanceMark

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("/my", response_model=list[AttendanceOut])
async def get_my_attendance(
    month: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]
    query = select(Attendance).where(Attendance.student_id == uid)

    if month:
        try:
            parts = month.split("-")
            year_val = int(parts[0])
            month_val = int(parts[1])
            query = query.where(
                extract("year", Attendance.date) == year_val,
                extract("month", Attendance.date) == month_val,
            )
        except Exception:
            pass

    query = query.order_by(Attendance.date.desc())
    res = await db.execute(query)
    return res.scalars().all()


@router.post("/mark", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    payload: AttendanceMark,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("student")),
):
    uid = UUID(user["id"]) if isinstance(user["id"], str) else user["id"]

    # Get active assignment
    res_asm = await db.execute(
        select(Assignment).where(
            Assignment.student_id == uid,
            Assignment.status.in_(["active", "pending_joining"]),
        ).order_by(Assignment.created_at.desc())
    )
    asm = res_asm.scalar_one_or_none()

    if not asm:
        # Fallback to any assignment
        res_any = await db.execute(
            select(Assignment).where(Assignment.student_id == uid).limit(1)
        )
        asm = res_any.scalar_one_or_none()

    if not asm:
        raise HTTPException(400, "No active internship assignment found to mark attendance.")

    # Check if attendance already marked for date
    res_existing = await db.execute(
        select(Attendance).where(
            Attendance.student_id == uid,
            Attendance.date == payload.date,
        )
    )
    att = res_existing.scalar_one_or_none()

    if att:
        att.status = payload.status
        att.hours = payload.hours
        att.notes = payload.notes
    else:
        att = Attendance(
            assignment_id=asm.id,
            student_id=uid,
            date=payload.date,
            status=payload.status,
            hours=payload.hours,
            notes=payload.notes,
            created_at=datetime.now(timezone.utc),
        )
        db.add(att)

    await db.commit()
    await db.refresh(att)
    return att


@router.get("/assignment/{assignment_id}", response_model=list[AttendanceOut])
async def get_assignment_attendance(
    assignment_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: dict = Depends(require_role("faculty")),
):
    res = await db.execute(
        select(Attendance)
        .where(Attendance.assignment_id == assignment_id)
        .order_by(Attendance.date.desc())
    )
    return res.scalars().all()
