import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from database import Base, engine
import models

def test_backend_flow():
    with TestClient(app) as client:
        print("Database tables initialized successfully!")
        
        # Test registering a student
        reg_response = client.post("/auth/register", json={
            "email": "teststudent@agentic.com",
            "full_name": "Test Student",
            "password": "studentpassword"
        })
        
        # It will succeed (200) or return 400 if already exists
        assert reg_response.status_code in [200, 400], f"Registration failed: {reg_response.text}"
        print("Student registration endpoint test passed!")
        
        # Test getting auth token for default admin
        login_response = client.post("/auth/token", data={
            "username": "admin@agentic.com",
            "password": "adminpassword"
        })
        
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        token_data = login_response.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        print("Admin login token retrieval test passed!")
        
        # Test reading syllabus content
        response = client.get("/lessons")
        assert response.status_code == 200
        data = response.json()
        assert "day1" in data
        assert "day2" in data
        assert "day3" in data
        print("Syllabus lessons retrieval test passed!")

if __name__ == "__main__":
    print("Running backend tests with startup event triggers...")
    test_backend_flow()
    print("All backend tests completed successfully!")
