from fastapi import APIRouter
from app.api.v1 import (
    auth, institutes, internships, applications,
    faculty, admin, company,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(institutes.router)
api_router.include_router(internships.router)
api_router.include_router(applications.router)
api_router.include_router(faculty.router)
api_router.include_router(admin.router)
api_router.include_router(company.router)