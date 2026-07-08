import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student")  # 'student', 'admin', 'instructor'
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)
    registration_date = Column(DateTime, default=datetime.datetime.utcnow)
    current_streak = Column(Integer, default=0)
    last_active_date = Column(DateTime, nullable=True)

    # Relationships
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    quiz_submissions = relationship("QuizSubmission", back_populates="user", cascade="all, delete-orphan")
    project_submissions = relationship("ProjectSubmission", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(String, nullable=False)  # e.g., 'day1_mod1'
    topic_id = Column(String, nullable=False)   # e.g., 'what_is_ai'
    completed = Column(Boolean, default=False)
    time_spent = Column(Integer, default=0)     # time spent in seconds
    completion_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="progress")

class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(String, nullable=False)    # e.g., 'day1_quiz'
    score = Column(Integer, nullable=False)
    out_of = Column(Integer, nullable=False)
    passed = Column(Boolean, default=False)
    submission_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quiz_submissions")

class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(String, nullable=False) # e.g., 'day1_project', 'capstone'
    repo_url = Column(String, nullable=False)
    hosted_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="pending")  # 'pending', 'approved', 'rejected'
    instructor_feedback = Column(Text, nullable=True)
    submission_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="project_submissions")

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(String, nullable=False)
    topic_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookmarks")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(String, nullable=False)
    topic_id = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notes")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_name = Column(String, default="Instructor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ApprovalList(Base):
    __tablename__ = "approval_list"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    allowed = Column(Boolean, default=True)
