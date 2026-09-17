from fastapi import APIRouter
from app.api.v1 import auth, internships, applications, faculty

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(internships.router)
api_router.include_router(applications.router)
api_router.include_router(faculty.router)