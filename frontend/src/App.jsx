import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import CoursePlayer from './components/CoursePlayer';
import AdminPanel from './components/AdminPanel';
import { api } from './utils/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerEmail, setRegisterEmail] = useState('');
  
  // Course player navigation state
  const [courseDay, setCourseDay] = useState('day1');
  const [courseTopicId, setCourseTopicId] = useState(null);

  // On mount: check for existing session token
  useEffect(() => {
    async function checkSession() {
      const token = localStorage.getItem('agentic_lms_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          setCurrentPage('dashboard');
        } catch (err) {
          // Token expired or invalid — clear it
          localStorage.removeItem('agentic_lms_token');
          localStorage.removeItem('agentic_lms_user_email');
          setCurrentPage('landing');
        }
      } else {
        setCurrentPage('landing');
      }
      setLoading(false);
    }
    checkSession();
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('agentic_lms_token');
    localStorage.removeItem('agentic_lms_user_email');
    setUser(null);
    setCurrentPage('landing');
  };

  const handleStartLesson = (day, topicId) => {
    setCourseDay(day);
    setCourseTopicId(topicId);
    setCurrentPage('course_player');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleRegisterSuccess = (email) => {
    setRegisterEmail(email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/30"></div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Initializing AGENTIC 003 LMS...</p>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case 'landing':
      return (
        <LandingPage 
          onNavigate={handleNavigate}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );

    case 'login':
      return (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          defaultEmail={registerEmail}
        />
      );

    case 'dashboard':
      if (!user) {
        setCurrentPage('login');
        return null;
      }
      return (
        <StudentDashboard
          user={user}
          onLogout={handleLogout}
          onStartLesson={handleStartLesson}
          onNavigate={handleNavigate}
        />
      );

    case 'course_player':
      if (!user) {
        setCurrentPage('login');
        return null;
      }
      return (
        <CoursePlayer
          user={user}
          initialDay={courseDay}
          initialTopicId={courseTopicId}
          onBackToDashboard={() => setCurrentPage('dashboard')}
        />
      );

    case 'admin_panel':
      if (!user || user.role !== 'admin') {
        setCurrentPage('dashboard');
        return null;
      }
      return (
        <AdminPanel
          user={user}
          onBackToDashboard={() => setCurrentPage('dashboard')}
        />
      );

    default:
      return (
        <LandingPage 
          onNavigate={handleNavigate}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
  }
}
