from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, desc, text as sql_text
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.db.session import get_db
from app.core.deps import require_role
from app.models import (
    User, Role, Company, Institute, Internship,
    Application, Policy, AuditLog,
)

router = APIRouter(prefix="/admin", tags=["admin"])


def _clean_uuid(v):
    """Convert empty string to None for UUID columns."""
    if v is None or v == "":
        return None
    return v


def _clean_str(v):
    """Convert empty string to None for text columns."""
    if v is None or (isinstance(v, str) and v.strip() == ""):
        return None
    return v


# ============================================================
# DASHBOARD
# ============================================================
@router.get("/dashboard")
async def dashboard(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    total_users = await db.scalar(select(func.count()).select_from(User))
    active_internships = await db.scalar(
        select(func.count()).select_from(Internship).where(Internship.status == "open")
    )
    verified_companies = await db.scalar(
        select(func.count()).select_from(Company).where(Company.verified == True)
    )
    pending_users = await db.scalar(
        select(func.count()).select_from(User).where(User.status == "inactive")
    )
    pending_companies = await db.scalar(
        select(func.count()).select_from(Company).where(Company.verified == False)
    )

    role_rows = await db.execute(
        select(Role.code, func.count(User.id))
        .join(User, User.role_id == Role.id, isouter=True)
        .group_by(Role.code)
    )
    role_distribution = [{"role": r, "count": c} for (r, c) in role_rows.all()]

    six_months_ago = datetime.now(timezone.utc) - timedelta(days=180)
    month_rows = await db.execute(
        select(
            func.to_char(User.created_at, "YYYY-MM").label("month"),
            func.count(User.id).label("count"),
        )
        .where(User.created_at >= six_months_ago)
        .group_by("month")
        .order_by("month")
    )
    monthly_signups = [{"month": m, "count": c} for (m, c) in month_rows.all()]

    return {
        "total_users": total_users or 0,
        "active_internships": active_internships or 0,
        "verified_companies": verified_companies or 0,
        "pending_users": pending_users or 0,
        "pending_companies": pending_companies or 0,
        "role_distribution": role_distribution,
        "monthly_signups": monthly_signups,
    }


# ============================================================
# USERS
# ============================================================
@router.get("/users")
async def list_users(
    role_filter: Optional[str] = Query(None, alias="role"),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    stmt = (
        select(User, Role.code, Institute.name)
        .join(Role, Role.id == User.role_id, isouter=True)
        .join(Institute, Institute.id == User.institute_id, isouter=True)
        .order_by(User.created_at.desc())
    )
    if role_filter and role_filter != "all":
        stmt = stmt.where(Role.code == role_filter)
    if status_filter and status_filter != "all":
        stmt = stmt.where(User.status == status_filter)

    result = await db.execute(stmt)
    return [
        {
            "id": str(u.id),
            "email": u.email,
            "name": u.name,
            "role": rc or "student",
            "status": u.status,
            "is_super_admin": u.is_super_admin,
            "institute": inst_name,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "approved_at": u.approved_at.isoformat() if u.approved_at else None,
        }
        for (u, rc, inst_name) in result.all()
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
    u.status = "active"
    u.approved_at = datetime.now(timezone.utc)
    u.approved_by = admin["id"]
    await db.commit()

    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="user.approve", entity_type="user",
        entity_id=user_id, metadata_={"email": u.email},
    ))
    await db.commit()
    return {"id": str(u.id), "status": u.status}


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

    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="user.reject", entity_type="user",
        entity_id=user_id, metadata_={"email": u.email},
    ))
    await db.commit()
    return {"id": str(u.id), "status": u.status}


# ============================================================
# COMPANIES
# ============================================================
@router.get("/companies")
async def list_companies(
    verified: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    stmt = select(Company).order_by(Company.created_at.desc())
    if verified is not None:
        stmt = stmt.where(Company.verified == verified)

    result = await db.execute(stmt)
    return [
        {
            "id": str(c.id), "name": c.name, "industry": c.industry,
            "location": c.location, "website": c.website,
            "contact_email": c.contact_email,
            "hr_spoc_name": c.hr_spoc_name, "hr_spoc_email": c.hr_spoc_email,
            "hr_spoc_phone": c.hr_spoc_phone,
            "verified": c.verified,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in result.scalars().all()
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

    if c.hr_spoc_user_id:
        u_result = await db.execute(select(User).where(User.id == c.hr_spoc_user_id))
        hr = u_result.scalar_one_or_none()
        if hr:
            hr.status = "active"
            hr.approved_at = datetime.now(timezone.utc)
            hr.approved_by = admin["id"]

    await db.commit()
    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="company.verify", entity_type="company",
        entity_id=company_id, metadata_={"name": c.name},
    ))
    await db.commit()
    return {"id": str(c.id), "verified": True}


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
    if c.hr_spoc_user_id:
        u_result = await db.execute(select(User).where(User.id == c.hr_spoc_user_id))
        hr = u_result.scalar_one_or_none()
        if hr:
            hr.status = "suspended"
    await db.commit()

    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="company.reject", entity_type="company",
        entity_id=company_id, metadata_={"name": c.name},
    ))
    await db.commit()
    return {"id": str(c.id), "verified": False}


# ============================================================
# DEPARTMENTS
# ============================================================
@router.get("/departments")
async def list_departments(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(sql_text("""
        select d.id, d.name, d.code, d.description, d.institute_id,
               i.name as institute_name,
               (select count(*) from public.users u where u.institute_id = d.institute_id) as user_count
        from public.departments d
        left join public.institutes i on i.id = d.institute_id
        order by d.name asc
    """))
    return [
        {
            "id": str(r["id"]),
            "name": r["name"],
            "code": r["code"],
            "description": r["description"],
            "institute_id": str(r["institute_id"]) if r["institute_id"] else None,
            "institute_name": r["institute_name"],
            "user_count": r["user_count"] or 0,
        }
        for r in result.mappings().all()
    ]


@router.post("/departments")
async def create_department(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    name = _clean_str(payload.get("name"))
    if not name:
        raise HTTPException(400, "Department name is required")

    try:
        result = await db.execute(sql_text("""
            insert into public.departments (name, code, description, institute_id)
            values (:name, :code, :description, :institute_id)
            returning id, name, code
        """), {
            "name": name,
            "code": _clean_str(payload.get("code")),
            "description": _clean_str(payload.get("description")),
            "institute_id": _clean_uuid(payload.get("institute_id")),
        })
        row = result.mappings().first()
        await db.commit()

        db.add(AuditLog(
            actor_id=admin["id"], actor_role="admin",
            action="department.create", entity_type="department",
            entity_id=row["id"], metadata_={"name": row["name"]},
        ))
        await db.commit()

        return {"id": str(row["id"]), "name": row["name"], "code": row["code"]}
    except Exception as e:
        await db.rollback()
        raise HTTPException(400, f"Failed to create department: {str(e)}")


@router.delete("/departments/{dept_id}", status_code=204)
async def delete_department(
    dept_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    await db.execute(
        sql_text("delete from public.departments where id = :id"),
        {"id": str(dept_id)},
    )
    await db.commit()

    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="department.delete", entity_type="department",
        entity_id=dept_id,
    ))
    await db.commit()
    return None


# ============================================================
# POLICIES
# ============================================================
@router.get("/policies")
async def list_policies(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(select(Policy).order_by(Policy.key.asc()))
    return [
        {
            "id": str(p.id),
            "key": p.key,
            "value": p.value,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        }
        for p in result.scalars().all()
    ]


@router.put("/policies")
async def update_policies(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    for key, value in payload.items():
        result = await db.execute(select(Policy).where(Policy.key == key))
        p = result.scalar_one_or_none()
        if p:
            p.value = value
            p.updated_by = admin["id"]
            p.updated_at = datetime.now(timezone.utc)
        else:
            db.add(Policy(key=key, value=value, updated_by=admin["id"]))

    await db.commit()

    db.add(AuditLog(
        actor_id=admin["id"], actor_role="admin",
        action="policy.update", entity_type="policy",
        metadata_=payload,
    ))
    await db.commit()
    return {"updated": list(payload.keys())}


# ============================================================
# AUDIT LOGS
# ============================================================
@router.get("/audit-logs")
async def list_audit_logs(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(
        select(AuditLog, User.name)
        .join(User, User.id == AuditLog.actor_id, isouter=True)
        .order_by(desc(AuditLog.created_at))
        .limit(limit)
    )
    return [
        {
            "id": str(log.id),
            "actor_id": str(log.actor_id) if log.actor_id else None,
            "actor_name": actor_name or "System",
            "actor_role": log.actor_role,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": str(log.entity_id) if log.entity_id else None,
            "metadata": log.metadata_,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for (log, actor_name) in result.all()
    ]


# ============================================================
# ACCESS CONTROL
# ============================================================
@router.get("/access-control")
async def access_control(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    result = await db.execute(sql_text("""
        select r.code as role, r.name as role_name,
               coalesce(array_agg(p.code) filter (where p.code is not null), '{}') as permissions
        from public.roles r
        left join public.role_permissions rp on rp.role_id = r.id
        left join public.permissions p on p.id = rp.permission_id
        group by r.code, r.name
        order by r.code
    """))
    return [
        {
            "role": r["role"],
            "role_name": r["role_name"],
            "permissions": list(r["permissions"] or []),
        }
        for r in result.mappings().all()
    ]


# ============================================================
# SYSTEM MONITORING
# ============================================================
@router.get("/system-monitoring")
async def system_monitoring(
    db: AsyncSession = Depends(get_db),
    admin: dict = Depends(require_role("admin")),
):
    db_version = (await db.execute(sql_text("select version()"))).scalar()
    active_conn = (await db.execute(sql_text(
        "select count(*) from pg_stat_activity where state = 'active'"
    ))).scalar()
    total_users = await db.scalar(select(func.count()).select_from(User))
    total_internships = await db.scalar(select(func.count()).select_from(Internship))
    total_applications = await db.scalar(select(func.count()).select_from(Application))

    return {
        "status": "healthy",
        "database": {
            "connected": True,
            "version": db_version.split(",")[0] if db_version else "unknown",
            "active_connections": active_conn or 0,
        },
        "counts": {
            "users": total_users or 0,
            "internships": total_internships or 0,
            "applications": total_applications or 0,
        },
    }