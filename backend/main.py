import datetime
from typing import List, Dict
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
import auth
from database import engine, Base, get_db
from workshop_content import WORKSHOP_CONTENT

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AGENTIC 003 LMS API", version="1.0.0")

# Root health check — required so frontend probe recognises the backend as online
@app.get("/")
def health_check():
    return {"status": "ok", "service": "AGENTIC 003 LMS API", "version": "1.0.0"}

import os

frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed default admin user on startup if no users exist
# Seed default admin and student users on startup
@app.on_event("startup")
def startup_db_setup():
    db = next(get_db())
    try:
        admin_exists = db.query(models.User).filter(models.User.role == "admin").first()
        if not admin_exists:
            hashed_pw = auth.get_password_hash("adminpassword")
            admin_user = models.User(
                email="admin@agentic.com",
                hashed_password=hashed_pw,
                full_name="System Administrator",
                role="admin",
                is_active=True,
                is_approved=True,
                registration_date=datetime.datetime.utcnow(),
                current_streak=1
            )
            db.add(admin_user)
            # Seed default whitelist emails
            default_emails = ["student@agentic.com", "developer@agentic.com"]
            for email in default_emails:
                existing = db.query(models.ApprovalList).filter(models.ApprovalList.email == email).first()
                if not existing:
                    db.add(models.ApprovalList(email=email, allowed=True))
            db.commit()
            print("Default admin 'admin@agentic.com' with password 'adminpassword' created.")
            
        student_exists = db.query(models.User).filter(models.User.email == "student@agentic.com").first()
        if not student_exists:
            hashed_student_pw = auth.get_password_hash("studentpassword")
            student_user = models.User(
                email="student@agentic.com",
                hashed_password=hashed_student_pw,
                full_name="Jane Doe",
                role="student",
                is_active=True,
                is_approved=True,
                registration_date=datetime.datetime.utcnow(),
                current_streak=3
            )
            db.add(student_user)
            db.commit()
            print("Default student 'student@agentic.com' with password 'studentpassword' created.")
            
    except Exception as e:
        print(f"Startup error: {e}")
    finally:
        db.close()


# --- AUTHENTICATION ENDPOINTS ---

@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    # Check whitelist
    whitelist_entry = db.query(models.ApprovalList).filter(models.ApprovalList.email == user_in.email).first()
    
    # First user or whitelisted user is automatically approved
    total_users = db.query(func.count(models.User.id)).scalar()
    is_approved = True if (total_users == 0 or (whitelist_entry and whitelist_entry.allowed)) else False
    role = "admin" if total_users == 0 else "student"
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=auth.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=role,
        is_active=True,
        is_approved=is_approved,
        registration_date=datetime.datetime.utcnow(),
        current_streak=0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Your account has been locked.")
    
    # Update active streak and last active date
    today = datetime.date.today()
    if user.last_active_date:
        last_active = user.last_active_date.date()
        if last_active == today - datetime.timedelta(days=1):
            user.current_streak += 1
        elif last_active < today - datetime.timedelta(days=1):
            user.current_streak = 1
    else:
        user.current_streak = 1
        
    user.last_active_date = datetime.datetime.utcnow()
    db.commit()
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.UserResponse)
def get_current_user_profile(user: models.User = Depends(auth.get_current_user)):
    return user


# --- COURSE & CURRICULUM ENDPOINTS ---

@app.get("/lessons")
def get_lessons():
    # In a full app, you might hide specific days based on global settings.
    # We will return the full JSON structure
    return WORKSHOP_CONTENT


# --- STUDENT PROGRESS & INTERACTION ENDPOINTS ---

@app.get("/progress", response_model=List[schemas.UserProgressResponse])
def get_user_progress(user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    return db.query(models.UserProgress).filter(models.UserProgress.user_id == user.id).all()

@app.post("/progress/update", response_model=schemas.UserProgressResponse)
def update_progress(
    progress_in: schemas.UserProgressCreate, 
    user: models.User = Depends(auth.get_approved_user), 
    db: Session = Depends(get_db)
):
    # Check if progress record exists
    existing = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.module_id == progress_in.module_id,
        models.UserProgress.topic_id == progress_in.topic_id
    ).first()
    
    if existing:
        existing.completed = progress_in.completed
        existing.time_spent += progress_in.time_spent
        existing.completion_date = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    
    new_progress = models.UserProgress(
        user_id=user.id,
        module_id=progress_in.module_id,
        topic_id=progress_in.topic_id,
        completed=progress_in.completed,
        time_spent=progress_in.time_spent,
        completion_date=datetime.datetime.utcnow()
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress

# Bookmarks
@app.get("/bookmarks", response_model=List[schemas.BookmarkResponse])
def get_bookmarks(user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    return db.query(models.Bookmark).filter(models.Bookmark.user_id == user.id).all()

@app.post("/bookmarks", response_model=schemas.BookmarkResponse)
def add_bookmark(bookmark_in: schemas.BookmarkCreate, user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    existing = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user.id,
        models.Bookmark.module_id == bookmark_in.module_id,
        models.Bookmark.topic_id == bookmark_in.topic_id
    ).first()
    if existing:
        return existing
    new_bookmark = models.Bookmark(
        user_id=user.id,
        module_id=bookmark_in.module_id,
        topic_id=bookmark_in.topic_id
    )
    db.add(new_bookmark)
    db.commit()
    db.refresh(new_bookmark)
    return new_bookmark

@app.delete("/bookmarks/{module_id}/{topic_id}")
def delete_bookmark(module_id: str, topic_id: str, user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    bookmark = db.query(models.Bookmark).filter(
        models.Bookmark.user_id == user.id,
        models.Bookmark.module_id == module_id,
        models.Bookmark.topic_id == topic_id
    ).first()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found.")
    db.delete(bookmark)
    db.commit()
    return {"detail": "Bookmark deleted."}

# Notes
@app.get("/notes/{module_id}/{topic_id}", response_model=schemas.NoteResponse)
def get_note(module_id: str, topic_id: str, user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(
        models.Note.user_id == user.id,
        models.Note.module_id == module_id,
        models.Note.topic_id == topic_id
    ).first()
    if not note:
        return {"module_id": module_id, "topic_id": topic_id, "content": "", "id": 0, "user_id": user.id, "updated_at": datetime.datetime.utcnow()}
    return note

@app.post("/notes", response_model=schemas.NoteResponse)
def save_note(note_in: schemas.NoteCreate, user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    existing = db.query(models.Note).filter(
        models.Note.user_id == user.id,
        models.Note.module_id == note_in.module_id,
        models.Note.topic_id == note_in.topic_id
    ).first()
    
    if existing:
        existing.content = note_in.content
        existing.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    
    new_note = models.Note(
        user_id=user.id,
        module_id=note_in.module_id,
        topic_id=note_in.topic_id,
        content=note_in.content
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


# --- QUIZ & PROJECT SUBMISSIONS ---

@app.post("/quiz/submit", response_model=schemas.QuizSubmissionResponse)
def submit_quiz(
    submission: schemas.QuizSubmissionCreate, 
    user: models.User = Depends(auth.get_approved_user), 
    db: Session = Depends(get_db)
):
    # Save submission
    new_sub = models.QuizSubmission(
        user_id=user.id,
        quiz_id=submission.quiz_id,
        score=submission.score,
        out_of=submission.out_of,
        passed=submission.passed
    )
    db.add(new_sub)
    
    # Save a progress entry as completed for the quiz
    progress_existing = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.id,
        models.UserProgress.module_id == submission.quiz_id,
        models.UserProgress.topic_id == "quiz"
    ).first()
    
    if not progress_existing:
        progress = models.UserProgress(
            user_id=user.id,
            module_id=submission.quiz_id,
            topic_id="quiz",
            completed=submission.passed,
            time_spent=120,
            completion_date=datetime.datetime.utcnow()
        )
        db.add(progress)
    else:
        progress_existing.completed = submission.passed
        progress_existing.completion_date = datetime.datetime.utcnow()
        
    db.commit()
    db.refresh(new_sub)
    return new_sub

@app.post("/project/submit", response_model=schemas.ProjectSubmissionResponse)
def submit_project(
    project_in: schemas.ProjectSubmissionCreate,
    user: models.User = Depends(auth.get_approved_user),
    db: Session = Depends(get_db)
):
    # Check if already submitted
    existing = db.query(models.ProjectSubmission).filter(
        models.ProjectSubmission.user_id == user.id,
        models.ProjectSubmission.project_id == project_in.project_id
    ).first()
    
    if existing:
        existing.repo_url = project_in.repo_url
        existing.hosted_url = project_in.hosted_url
        existing.notes = project_in.notes
        existing.status = "pending" # Reset to pending on resubmission
        existing.submission_date = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
        
    new_sub = models.ProjectSubmission(
        user_id=user.id,
        project_id=project_in.project_id,
        repo_url=project_in.repo_url,
        hosted_url=project_in.hosted_url,
        notes=project_in.notes,
        status="pending"
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub

@app.get("/projects", response_model=List[schemas.ProjectSubmissionResponse])
def get_user_projects(user: models.User = Depends(auth.get_approved_user), db: Session = Depends(get_db)):
    return db.query(models.ProjectSubmission).filter(models.ProjectSubmission.user_id == user.id).all()


# --- LEADERBOARD & ANNOUNCEMENTS ---

@app.get("/leaderboard", response_model=List[schemas.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    # Calculate leaderboard based on user streak and quiz scores
    users = db.query(models.User).filter(models.User.role == "student").all()
    results = []
    
    for u in users:
        # Get count of lessons completed
        lessons_count = db.query(func.count(models.UserProgress.id)).filter(
            models.UserProgress.user_id == u.id,
            models.UserProgress.completed == True
        ).scalar() or 0
        
        # Get average quiz score
        avg_score = db.query(func.avg(models.QuizSubmission.score / models.QuizSubmission.out_of)).filter(
            models.QuizSubmission.user_id == u.id
        ).scalar() or 0.0
        
        results.append({
            "full_name": u.full_name,
            "current_streak": u.current_streak,
            "quiz_average": round(float(avg_score) * 100, 1),
            "lessons_completed": lessons_count
        })
        
    # Sort by lessons completed then streak
    results.sort(key=lambda x: (x["lessons_completed"], x["quiz_average"], x["current_streak"]), reverse=True)
    return results[:10]  # Return top 10

@app.get("/announcements", response_model=List[schemas.AnnouncementResponse])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).all()


# --- ADMIN ENDPOINTS ---

@app.get("/admin/stats", response_model=schemas.AdminStats)
def get_admin_statistics(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    total_students = db.query(func.count(models.User.id)).filter(models.User.role == "student").scalar() or 0
    active_streaks = db.query(func.count(models.User.id)).filter(models.User.role == "student", models.User.current_streak > 1).scalar() or 0
    pending_projects = db.query(func.count(models.ProjectSubmission.id)).filter(models.ProjectSubmission.status == "pending").scalar() or 0
    
    avg_score = db.query(func.avg(models.QuizSubmission.score / models.QuizSubmission.out_of)).scalar() or 0.0
    
    # A user qualifies for certificate if they complete Day 3 capstone and pass all quizzes
    passed_capstones = db.query(func.count(models.ProjectSubmission.id)).filter(
        models.ProjectSubmission.project_id == "day3_project",
        models.ProjectSubmission.status == "approved"
    ).scalar() or 0
    
    return {
        "total_students": total_students,
        "active_streaks": active_streaks,
        "pending_projects": pending_projects,
        "average_quiz_score": round(float(avg_score) * 100, 1),
        "total_certificates": passed_capstones
    }

@app.get("/admin/students", response_model=List[schemas.UserResponse])
def list_students(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "student").all()

@app.post("/admin/students/{student_id}/approve", response_model=schemas.UserResponse)
def approve_student(student_id: int, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    student.is_approved = True
    db.commit()
    db.refresh(student)
    return student

@app.post("/admin/students/{student_id}/lock", response_model=schemas.UserResponse)
def toggle_lock_student(student_id: int, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    student.is_active = not student.is_active
    db.commit()
    db.refresh(student)
    return student

@app.get("/admin/submissions", response_model=List[schemas.ProjectSubmissionResponse])
def get_all_submissions(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    submissions = db.query(models.ProjectSubmission).all()
    # Attach users for display
    for sub in submissions:
        sub.user = db.query(models.User).filter(models.User.id == sub.user_id).first()
    return submissions

@app.post("/admin/submissions/{submission_id}/grade", response_model=schemas.ProjectSubmissionResponse)
def grade_submission(
    submission_id: int,
    grade: schemas.ProjectSubmissionUpdate,
    admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    sub = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found.")
    
    sub.status = grade.status
    sub.instructor_feedback = grade.instructor_feedback
    
    # If approved, write completed progress for the project
    if grade.status == "approved":
        progress_existing = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == sub.user_id,
            models.UserProgress.module_id == sub.project_id,
            models.UserProgress.topic_id == "project"
        ).first()
        
        if not progress_existing:
            progress = models.UserProgress(
                user_id=sub.user_id,
                module_id=sub.project_id,
                topic_id="project",
                completed=True,
                time_spent=3600,
                completion_date=datetime.datetime.utcnow()
            )
            db.add(progress)
            
    db.commit()
    db.refresh(sub)
    sub.user = db.query(models.User).filter(models.User.id == sub.user_id).first()
    return sub

@app.post("/admin/announcements", response_model=schemas.AnnouncementResponse)
def create_announcement(
    ann: schemas.AnnouncementCreate,
    admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    new_ann = models.Announcement(
        title=ann.title,
        content=ann.content,
        author_name=ann.author_name or admin.full_name
    )
    db.add(new_ann)
    db.commit()
    db.refresh(new_ann)
    return new_ann

# Whitelist endpoints
@app.get("/admin/whitelist", response_model=List[schemas.ApprovalEmailResponse])
def get_whitelist(admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    return db.query(models.ApprovalList).all()

@app.post("/admin/whitelist", response_model=schemas.ApprovalEmailResponse)
def add_to_whitelist(
    entry: schemas.ApprovalEmailCreate,
    admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(models.ApprovalList).filter(models.ApprovalList.email == entry.email).first()
    if existing:
        existing.allowed = entry.allowed
        db.commit()
        db.refresh(existing)
        return existing
        
    new_entry = models.ApprovalList(email=entry.email, allowed=entry.allowed)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@app.delete("/admin/whitelist/{email}")
def delete_from_whitelist(email: str, admin: models.User = Depends(auth.get_current_admin), db: Session = Depends(get_db)):
    entry = db.query(models.ApprovalList).filter(models.ApprovalList.email == email).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Email not whitelisted.")
    db.delete(entry)
    db.commit()
    return {"detail": f"{email} removed from whitelist."}
