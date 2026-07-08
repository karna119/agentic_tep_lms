// Dual-Mode API Adapter (FastAPI Backend + LocalStorage Simulation Fallback)
import { STATIC_WORKSHOP_CONTENT } from './workshopContent.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let isSimulationMode = false;
let backendStatusCached = null; // null = not checked yet

// Helper to check if backend is online — only probes once, caches result forever
async function checkBackendOnline() {
  if (backendStatusCached !== null) return backendStatusCached;

  try {
    const res = await fetch(`${API_BASE}/`, { method: 'GET', signal: AbortSignal.timeout(1000) });
    backendStatusCached = res.ok;
    if (!res.ok) {
      console.warn('⚠️ FastAPI backend unreachable. Switching to LocalStorage Simulation Mode.');
      isSimulationMode = true;
    } else {
      console.log('🔌 FastAPI Backend detected. Using server mode.');
      isSimulationMode = false;
    }
  } catch {
    console.warn('⚠️ FastAPI backend offline. Falling back to LocalStorage Simulation Mode.');
    backendStatusCached = false;
    isSimulationMode = true;
  }
  return backendStatusCached;
}


// Global headers helper
function getHeaders() {
  const token = localStorage.getItem('agentic_lms_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- LOCAL STORAGE SIMULATOR ENGINE ---
const MOCK_DB = {
  getUsers: () => JSON.parse(localStorage.getItem('sim_users') || '[]'),
  setUsers: (users) => localStorage.setItem('sim_users', JSON.stringify(users)),
  
  getProgress: () => JSON.parse(localStorage.getItem('sim_progress') || '[]'),
  setProgress: (prog) => localStorage.setItem('sim_progress', JSON.stringify(prog)),
  
  getQuizzes: () => JSON.parse(localStorage.getItem('sim_quizzes') || '[]'),
  setQuizzes: (quizzes) => localStorage.setItem('sim_quizzes', JSON.stringify(quizzes)),
  
  getProjects: () => JSON.parse(localStorage.getItem('sim_projects') || '[]'),
  setProjects: (projects) => localStorage.setItem('sim_projects', JSON.stringify(projects)),
  
  getBookmarks: () => JSON.parse(localStorage.getItem('sim_bookmarks') || '[]'),
  setBookmarks: (bookmarks) => localStorage.setItem('sim_bookmarks', JSON.stringify(bookmarks)),
  
  getNotes: () => JSON.parse(localStorage.getItem('sim_notes') || '[]'),
  setNotes: (notes) => localStorage.setItem('sim_notes', JSON.stringify(notes)),

  getWhitelist: () => JSON.parse(localStorage.getItem('sim_whitelist') || '["student@agentic.com", "developer@agentic.com"]'),
  setWhitelist: (wl) => localStorage.setItem('sim_whitelist', JSON.stringify(wl)),

  getAnnouncements: () => JSON.parse(localStorage.getItem('sim_announcements') || '[]'),
  setAnnouncements: (ann) => localStorage.setItem('sim_announcements', JSON.stringify(ann)),
};

// Seed default users in simulator if empty
if (!localStorage.getItem('sim_users')) {
  MOCK_DB.setUsers([
    {
      id: 1,
      email: 'admin@agentic.com',
      full_name: 'System Administrator',
      role: 'admin',
      is_active: true,
      is_approved: true,
      registration_date: new Date().toISOString(),
      current_streak: 5,
      _password: 'adminpassword',
    },
    {
      id: 2,
      email: 'student@agentic.com',
      full_name: 'Jane Doe',
      role: 'student',
      is_active: true,
      is_approved: true,
      registration_date: new Date().toISOString(),
      current_streak: 3,
      _password: 'studentpassword',
    }
  ]);
  
  // Seed sample announcements
  MOCK_DB.setAnnouncements([
    {
      id: 1,
      title: 'Welcome to AGENTIC 003 Workshop!',
      content: 'Get ready for 3 days of hands-on application building. Make sure to complete the Day 1 assignments to unlock Day 2.',
      author_name: 'Instructor',
      created_at: new Date().toISOString()
    }
  ]);
}

// --- PUBLIC API EXPORTS ---

export const api = {
  // Login
  login: async (email, password) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await fetch(`${API_BASE}/auth/token`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('agentic_lms_token', data.access_token);
      localStorage.setItem('agentic_lms_user_email', email);
      return data;
    } else {
      // Simulator login — verify against the stored password
      const users = MOCK_DB.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error('No account found with that email address.');

      // Accept: the user's own registered password, OR the demo shortcuts
      const storedPw = user._password || '';
      const isDemoAdmin   = password === 'adminpassword';
      const isDemoStudent = password === 'studentpassword';
      const isOwnPw       = storedPw && password === storedPw;

      if (!isDemoAdmin && !isDemoStudent && !isOwnPw) {
        throw new Error('Incorrect password. Please use the password you set during registration.');
      }
      if (!user.is_active) throw new Error('Your account has been locked.');

      // Update streak
      user.current_streak = (user.current_streak || 0) + 1;
      user.last_active_date = new Date().toISOString();
      MOCK_DB.setUsers(users);

      localStorage.setItem('agentic_lms_token', `mock-token-${user.id}`);
      localStorage.setItem('agentic_lms_user_email', user.email);
      return { access_token: `mock-token-${user.id}`, token_type: 'bearer' };
    }
  },

  // Register
  register: async (email, full_name, password) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Registration failed');
      }
      return res.json();
    } else {
      const users = MOCK_DB.getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already registered.');
      }
      
      const whitelist = MOCK_DB.getWhitelist();
      const isApproved = whitelist.includes(email.toLowerCase());
      
      const newId = users.length + 1;
      const newUser = {
        id: newId,
        email,
        full_name,
        role: 'student',
        is_active: true,
        is_approved: isApproved,
        registration_date: new Date().toISOString(),
        current_streak: 1,
        _password: password,   // store so login can verify it
      };
      
      users.push(newUser);
      MOCK_DB.setUsers(users);
      return newUser;
    }
  },

  // Get Me
  getMe: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user profiles');
      return res.json();
    } else {
      const email = localStorage.getItem('agentic_lms_user_email');
      if (!email) throw new Error('Not logged in');
      const users = MOCK_DB.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error('User profiles not found');
      // Strip internal simulation field before returning to UI
      const { _password, ...safeUser } = user;
      return safeUser;
    }
  },

  // Get Lessons Content
  getLessons: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/lessons`);
      return res.json();
    } else {
      // Return embedded static curriculum for offline simulation mode
      return STATIC_WORKSHOP_CONTENT;
    }
  },


  // Get Progress
  getProgress: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/progress`, { headers: getHeaders() });
      return res.json();
    } else {
      const user = await api.getMe();
      const prog = MOCK_DB.getProgress();
      return prog.filter(p => p.user_id === user.id);
    }
  },

  // Update Progress
  updateProgress: async (moduleId, topicId, completed, timeSpent = 60) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/progress/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ module_id: moduleId, topic_id: topicId, completed, time_spent: timeSpent }),
      });
      return res.json();
    } else {
      const user = await api.getMe();
      const prog = MOCK_DB.getProgress();
      const existing = prog.find(p => p.user_id === user.id && p.module_id === moduleId && p.topic_id === topicId);
      
      if (existing) {
        existing.completed = completed;
        existing.time_spent += timeSpent;
        existing.completion_date = new Date().toISOString();
      } else {
        prog.push({
          id: prog.length + 1,
          user_id: user.id,
          module_id: moduleId,
          topic_id: topicId,
          completed,
          time_spent: timeSpent,
          completion_date: new Date().toISOString()
        });
      }
      
      MOCK_DB.setProgress(prog);
      return { module_id: moduleId, topic_id: topicId, completed };
    }
  },

  // Bookmarks
  getBookmarks: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/bookmarks`, { headers: getHeaders() });
      return res.json();
    } else {
      const user = await api.getMe();
      const bookmarks = MOCK_DB.getBookmarks();
      return bookmarks.filter(b => b.user_id === user.id);
    }
  },

  addBookmark: async (moduleId, topicId) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/bookmarks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ module_id: moduleId, topic_id: topicId })
      });
      return res.json();
    } else {
      const user = await api.getMe();
      const bookmarks = MOCK_DB.getBookmarks();
      const existing = bookmarks.find(b => b.user_id === user.id && b.module_id === moduleId && b.topic_id === topicId);
      if (existing) return existing;
      
      const newB = { id: bookmarks.length + 1, user_id: user.id, module_id: moduleId, topic_id: topicId, created_at: new Date().toISOString() };
      bookmarks.push(newB);
      MOCK_DB.setBookmarks(bookmarks);
      return newB;
    }
  },

  deleteBookmark: async (moduleId, topicId) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      await fetch(`${API_BASE}/bookmarks/${moduleId}/${topicId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return { success: true };
    } else {
      const user = await api.getMe();
      let bookmarks = MOCK_DB.getBookmarks();
      bookmarks = bookmarks.filter(b => !(b.user_id === user.id && b.module_id === moduleId && b.topic_id === topicId));
      MOCK_DB.setBookmarks(bookmarks);
      return { success: true };
    }
  },

  // Notes
  getNote: async (moduleId, topicId) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/notes/${moduleId}/${topicId}`, { headers: getHeaders() });
      return res.json();
    } else {
      const user = await api.getMe();
      const notes = MOCK_DB.getNotes();
      const note = notes.find(n => n.user_id === user.id && n.module_id === moduleId && n.topic_id === topicId);
      return note || { module_id: moduleId, topic_id: topicId, content: '' };
    }
  },

  saveNote: async (moduleId, topicId, content) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ module_id: moduleId, topic_id: topicId, content })
      });
      return res.json();
    } else {
      const user = await api.getMe();
      const notes = MOCK_DB.getNotes();
      const existing = notes.find(n => n.user_id === user.id && n.module_id === moduleId && n.topic_id === topicId);
      
      if (existing) {
        existing.content = content;
        existing.updated_at = new Date().toISOString();
      } else {
        notes.push({
          id: notes.length + 1,
          user_id: user.id,
          module_id: moduleId,
          topic_id: topicId,
          content,
          updated_at: new Date().toISOString()
        });
      }
      MOCK_DB.setNotes(notes);
      return { module_id: moduleId, topic_id: topicId, content };
    }
  },

  // Submit Quiz
  submitQuiz: async (quizId, score, outOf, passed) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/quiz/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ quiz_id: quizId, score, out_of: outOf, passed })
      });
      return res.json();
    } else {
      const user = await api.getMe();
      const quizzes = MOCK_DB.getQuizzes();
      const newQ = {
        id: quizzes.length + 1,
        user_id: user.id,
        quiz_id: quizId,
        score,
        out_of: outOf,
        passed,
        submission_date: new Date().toISOString()
      };
      quizzes.push(newQ);
      MOCK_DB.setQuizzes(quizzes);
      
      // Update progress for the quiz topic
      await api.updateProgress(quizId, 'quiz', passed, 120);
      return newQ;
    }
  },

  // Submit Project
  submitProject: async (projectId, repoUrl, hostedUrl, notes) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/project/submit`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ project_id: projectId, repo_url: repoUrl, hosted_url: hostedUrl, notes })
      });
      return res.json();
    } else {
      const user = await api.getMe();
      const projects = MOCK_DB.getProjects();
      const existingIdx = projects.findIndex(p => p.user_id === user.id && p.project_id === projectId);
      
      const newP = {
        id: existingIdx >= 0 ? projects[existingIdx].id : projects.length + 1,
        user_id: user.id,
        project_id: projectId,
        repo_url: repoUrl,
        hosted_url: hostedUrl,
        notes,
        status: 'pending',
        submission_date: new Date().toISOString()
      };
      
      if (existingIdx >= 0) {
        projects[existingIdx] = newP;
      } else {
        projects.push(newP);
      }
      
      MOCK_DB.setProjects(projects);
      return newP;
    }
  },

  // Get user projects
  getUserProjects: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/projects`, { headers: getHeaders() });
      return res.json();
    } else {
      const user = await api.getMe();
      const projects = MOCK_DB.getProjects();
      return projects.filter(p => p.user_id === user.id);
    }
  },

  // Leaderboard
  getLeaderboard: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/leaderboard`);
      return res.json();
    } else {
      // Mock leaderboard generation
      const users = MOCK_DB.getUsers().filter(u => u.role === 'student');
      const progress = MOCK_DB.getProgress();
      const quizzes = MOCK_DB.getQuizzes();
      
      const leaderboard = users.map(u => {
        const uProg = progress.filter(p => p.user_id === u.id && p.completed);
        const uQuiz = quizzes.filter(q => q.user_id === u.id);
        const avg = uQuiz.length ? uQuiz.reduce((acc, q) => acc + (q.score / q.out_of), 0) / uQuiz.length : 0;
        
        return {
          full_name: u.full_name,
          current_streak: u.current_streak,
          quiz_average: Math.round(avg * 1000) / 10,
          lessons_completed: uProg.length
        };
      });
      
      leaderboard.sort((a, b) => b.lessons_completed - a.lessons_completed || b.quiz_average - a.quiz_average);
      return leaderboard;
    }
  },

  // Announcements
  getAnnouncements: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/announcements`);
      return res.json();
    } else {
      return MOCK_DB.getAnnouncements();
    }
  },

  // --- ADMIN API ENDPOINTS ---

  getAdminStats: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() });
      return res.json();
    } else {
      const users = MOCK_DB.getUsers().filter(u => u.role === 'student');
      const projects = MOCK_DB.getProjects();
      const quizzes = MOCK_DB.getQuizzes();
      
      const pendingCount = projects.filter(p => p.status === 'pending').length;
      const approvedCertificates = projects.filter(p => p.project_id === 'day3_project' && p.status === 'approved').length;
      const avgQuiz = quizzes.length ? quizzes.reduce((acc, q) => acc + (q.score / q.out_of), 0) / quizzes.length : 0;

      return {
        total_students: users.length,
        active_streaks: users.filter(u => u.current_streak > 1).length,
        pending_projects: pendingCount,
        average_quiz_score: Math.round(avgQuiz * 1000) / 10,
        total_certificates: approvedCertificates
      };
    }
  },

  getAdminStudents: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/students`, { headers: getHeaders() });
      return res.json();
    } else {
      return MOCK_DB.getUsers().filter(u => u.role === 'student');
    }
  },

  approveStudent: async (studentId) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/students/${studentId}/approve`, { method: 'POST', headers: getHeaders() });
      return res.json();
    } else {
      const users = MOCK_DB.getUsers();
      const user = users.find(u => u.id === studentId);
      if (user) {
        user.is_approved = true;
        MOCK_DB.setUsers(users);
      }
      return user;
    }
  },

  toggleLockStudent: async (studentId) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/students/${studentId}/lock`, { method: 'POST', headers: getHeaders() });
      return res.json();
    } else {
      const users = MOCK_DB.getUsers();
      const user = users.find(u => u.id === studentId);
      if (user) {
        user.is_active = !user.is_active;
        MOCK_DB.setUsers(users);
      }
      return user;
    }
  },

  getAdminSubmissions: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/submissions`, { headers: getHeaders() });
      return res.json();
    } else {
      const projects = MOCK_DB.getProjects();
      const users = MOCK_DB.getUsers();
      return projects.map(p => ({
        ...p,
        user: users.find(u => u.id === p.user_id)
      }));
    }
  },

  gradeSubmission: async (submissionId, status, feedback) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/submissions/${submissionId}/grade`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ status, instructor_feedback: feedback })
      });
      return res.json();
    } else {
      const projects = MOCK_DB.getProjects();
      const sub = projects.find(p => p.id === submissionId);
      if (sub) {
        sub.status = status;
        sub.instructor_feedback = feedback;
        MOCK_DB.setProjects(projects);
        
        // If approved, mark project topic progress completed
        if (status === 'approved') {
          const prog = MOCK_DB.getProgress();
          const existing = prog.find(p => p.user_id === sub.user_id && p.module_id === sub.project_id && p.topic_id === 'project');
          if (!existing) {
            prog.push({
              id: prog.length + 1,
              user_id: sub.user_id,
              module_id: sub.project_id,
              topic_id: 'project',
              completed: true,
              time_spent: 3600,
              completion_date: new Date().toISOString()
            });
            MOCK_DB.setProgress(prog);
          }
        }
      }
      const users = MOCK_DB.getUsers();
      return { ...sub, user: users.find(u => u.id === sub.user_id) };
    }
  },

  getWhitelist: async () => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/whitelist`, { headers: getHeaders() });
      return res.json();
    } else {
      const wl = MOCK_DB.getWhitelist();
      return wl.map((email, idx) => ({ id: idx + 1, email, allowed: true }));
    }
  },

  addToWhitelist: async (email, allowed = true) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/whitelist`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, allowed })
      });
      return res.json();
    } else {
      const wl = MOCK_DB.getWhitelist();
      if (!wl.includes(email.toLowerCase())) {
        wl.push(email.toLowerCase());
        MOCK_DB.setWhitelist(wl);
      }
      return { id: wl.length, email, allowed };
    }
  },

  deleteFromWhitelist: async (email) => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      await fetch(`${API_BASE}/admin/whitelist/${email}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return { success: true };
    } else {
      let wl = MOCK_DB.getWhitelist();
      wl = wl.filter(e => e.toLowerCase() !== email.toLowerCase());
      MOCK_DB.setWhitelist(wl);
      return { success: true };
    }
  },

  createAnnouncement: async (title, content, authorName = 'Instructor') => {
    const isOnline = await checkBackendOnline();
    if (isOnline) {
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, content, author_name: authorName })
      });
      return res.json();
    } else {
      const ann = MOCK_DB.getAnnouncements();
      const newA = {
        id: ann.length + 1,
        title,
        content,
        author_name: authorName,
        created_at: new Date().toISOString()
      };
      ann.unshift(newA); // Newest first
      MOCK_DB.setAnnouncements(ann);
      return newA;
    }
  }
};
