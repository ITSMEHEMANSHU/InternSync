from pydantic import BaseModel
from uuid import UUID


class ApproveResponse(BaseModel):
    id: UUID
    status: str
    message: str


class RejectRequest(BaseModel):
    reason: str | None = None