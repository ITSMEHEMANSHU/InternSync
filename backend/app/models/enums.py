from sqlalchemy.dialects.postgresql import ENUM as PGEnum

# ------------------------------------------------------------
# All Postgres enums — names & values must match the DB EXACTLY.
# create_type=False → SQLAlchemy never tries to create/drop them.
# ------------------------------------------------------------

UserRole = PGEnum(
    "student", "faculty", "company", "admin",
    name="user_role",
    create_type=False,
)

UserStatus = PGEnum(
    "active", "inactive", "suspended",
    name="user_status",
    create_type=False,
)

InternshipStatus = PGEnum(
    "draft", "open", "closed", "archived",
    name="internship_status",
    create_type=False,
)

ApplicationStatus = PGEnum(
    "pending", "under_review", "shortlisted",
    "approved", "rejected", "withdrawn",
    name="application_status",
    create_type=False,
)

AssignmentStatus = PGEnum(
    "pending_joining", "active", "completed", "terminated",
    name="assignment_status",
    create_type=False,
)

AttendanceStatus = PGEnum(
    "present", "absent", "leave", "holiday",
    name="attendance_status",
    create_type=False,
)

TaskStatus = PGEnum(
    "todo", "inprogress", "completed",
    name="task_status",
    create_type=False,
)

ReportStatus = PGEnum(
    "draft", "submitted", "under_review", "approved", "rejected",
    name="report_status",
    create_type=False,
)

DocumentType = PGEnum(
    "resume", "offer_letter", "joining_letter", "marksheet",
    "college_id", "final_report", "certificate", "other",
    name="document_type",
    create_type=False,
)

DocumentStatus = PGEnum(
    "pending", "uploaded", "ocr_processing", "ocr_verified", "rejected",
    name="document_status",
    create_type=False,
)

RiskLevel = PGEnum(
    "low", "medium", "high",
    name="risk_level",
    create_type=False,
)

NotificationType = PGEnum(
    "approval", "report", "task", "evaluation", "risk", "system",
    name="notification_type",
    create_type=False,
)