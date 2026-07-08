from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None
    current_streak: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    is_approved: bool
    registration_date: datetime
    current_streak: int
    last_active_date: Optional[datetime] = None

    class Config:
        from_attributes = True

# JWT Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Progress schemas
class UserProgressBase(BaseModel):
    module_id: str
    topic_id: str
    completed: bool
    time_spent: int

class UserProgressCreate(UserProgressBase):
    pass

class UserProgressResponse(UserProgressBase):
    id: int
    user_id: int
    completion_date: datetime

    class Config:
        from_attributes = True

# Quiz schemas
class QuizSubmissionCreate(BaseModel):
    quiz_id: str
    score: int
    out_of: int
    passed: bool

class QuizSubmissionResponse(BaseModel):
    id: int
    user_id: int
    quiz_id: str
    score: int
    out_of: int
    passed: bool
    submission_date: datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectSubmissionCreate(BaseModel):
    project_id: str
    repo_url: str
    hosted_url: Optional[str] = None
    notes: Optional[str] = None

class ProjectSubmissionUpdate(BaseModel):
    status: str  # 'approved', 'rejected'
    instructor_feedback: Optional[str] = None

class ProjectSubmissionResponse(BaseModel):
    id: int
    user_id: int
    project_id: str
    repo_url: str
    hosted_url: Optional[str] = None
    notes: Optional[str] = None
    status: str
    instructor_feedback: Optional[str] = None
    submission_date: datetime
    user: Optional[UserBase] = None

    class Config:
        from_attributes = True

# Bookmarks & Notes
class BookmarkCreate(BaseModel):
    module_id: str
    topic_id: str

class BookmarkResponse(BookmarkCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class NoteCreate(BaseModel):
    module_id: str
    topic_id: str
    content: str

class NoteResponse(NoteCreate):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Announcements
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    author_name: Optional[str] = "Instructor"

class AnnouncementResponse(AnnouncementCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Approval list
class ApprovalEmailCreate(BaseModel):
    email: EmailStr
    allowed: Optional[bool] = True

class ApprovalEmailResponse(ApprovalEmailCreate):
    id: int

    class Config:
        from_attributes = True

# Dashboard & Stats
class LeaderboardEntry(BaseModel):
    full_name: str
    current_streak: int
    quiz_average: float
    lessons_completed: int

class AdminStats(BaseModel):
    total_students: int
    active_streaks: int
    pending_projects: int
    average_quiz_score: float
    total_certificates: int
