import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { 
  Users, Award, Calendar, CheckSquare, 
  Trash2, ShieldCheck, UserMinus, UserCheck, 
  ArrowLeft, Download, Send, RefreshCw, X 
} from 'lucide-react';

export default function AdminPanel({ onBackToDashboard }) {
  const [stats, setStats] = useState({
    total_students: 0,
    active_streaks: 0,
    pending_projects: 0,
    average_quiz_score: 0,
    total_certificates: 0
  });
  
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [whitelistEmail, setWhitelistEmail] = useState('');
  
  // Grading popup state
  const [selectedSub, setSelectedSub] = useState(null);
  const [gradeStatus, setGradeStatus] = useState('approved');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Reload statistics and tables
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const sData = await api.getAdminStats();
      setStats(sData);
      
      const studList = await api.getAdminStudents();
      setStudents(studList);
      
      const subList = await api.getAdminSubmissions();
      setSubmissions(subList);
      
      const wlList = await api.getWhitelist();
      setWhitelist(wlList);
    } catch (err) {
      console.error('Error loading admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Approve student registration
  const handleApproveStudent = async (id) => {
    try {
      await api.approveStudent(id);
      loadAdminData();
      alert('Student registration approved!');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle lock status
  const handleToggleLockStudent = async (id) => {
    try {
      await api.toggleLockStudent(id);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Whitelist management
  const handleAddToWhitelist = async (e) => {
    e.preventDefault();
    if (!whitelistEmail) return;
    try {
      await api.addToWhitelist(whitelistEmail);
      setWhitelistEmail('');
      loadAdminData();
      alert('Email added to registration whitelist.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFromWhitelist = async (email) => {
    try {
      await api.deleteFromWhitelist(email);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Announcement push
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      await api.createAnnouncement(annTitle, annContent);
      setAnnTitle('');
      setAnnContent('');
      loadAdminData();
      alert('Announcement posted to student feeds.');
    } catch (err) {
      console.error(err);
    }
  };

  // Grade review submission
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      await api.gradeSubmission(selectedSub.id, gradeStatus, gradeFeedback);
      setSelectedSub(null);
      setGradeFeedback('');
      loadAdminData();
      alert('Project review saved successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Status', 'Approved', 'Current Streak'];
    const rows = students.map(s => [
      s.id,
      `"${s.full_name}"`,
      s.email,
      s.role,
      s.is_active ? 'Active' : 'Locked',
      s.is_approved ? 'Yes' : 'No',
      s.current_streak
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agentic_003_student_progress.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden pb-12">
      
      {/* Header navbar */}
      <nav className="glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center relative z-20">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <span className="font-extrabold text-base tracking-tight text-white block">AGENTIC 003</span>
          <span className="text-[10px] bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Instructor Portal</span>
        </div>

        <button 
          onClick={loadAdminData}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition hover:bg-slate-850"
          title="Refresh Data"
        >
          <RefreshCw size={14} />
        </button>
      </nav>

      {/* Main layout container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 relative z-10">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-card-dark/40 border border-white/5">
            <Users className="text-accent mb-2" size={20} />
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Students</span>
            <span className="text-2xl font-black text-white">{stats.total_students}</span>
          </div>
          <div className="p-4 rounded-xl bg-card-dark/40 border border-white/5">
            <CheckSquare className="text-primary mb-2" size={20} />
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Pending Reviews</span>
            <span className="text-2xl font-black text-white">{stats.pending_projects}</span>
          </div>
          <div className="p-4 rounded-xl bg-card-dark/40 border border-white/5">
            <Users className="text-orange-500 mb-2" size={20} />
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Streaks</span>
            <span className="text-2xl font-black text-white">{stats.active_streaks}</span>
          </div>
          <div className="p-4 rounded-xl bg-card-dark/40 border border-white/5">
            <ShieldCheck className="text-success mb-2" size={20} />
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Avg Quiz Score</span>
            <span className="text-2xl font-black text-white">{stats.average_quiz_score}%</span>
          </div>
          <div className="p-4 rounded-xl bg-card-dark/40 border border-white/5 col-span-2 md:col-span-1">
            <Award className="text-yellow-500 mb-2" size={20} />
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Issued Certs</span>
            <span className="text-2xl font-black text-white">{stats.total_certificates}</span>
          </div>
        </div>

        {/* BOTTOM SECTIONS: GRID OF ADMIN CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT AREA: STUDENT MANAGEMENT TABLE (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Student list */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-white">Student Roster</h3>
                  <p className="text-[10px] text-slate-400">View registered students, approve registration, or override status.</p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold">
                      <th className="py-2.5">Student Name</th>
                      <th className="py-2.5">Email</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Streak</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500 italic">No students registered yet.</td>
                      </tr>
                    ) : (
                      students.map(s => (
                        <tr key={s.id} className="text-slate-300">
                          <td className="py-3.5 font-semibold text-white">{s.full_name}</td>
                          <td className="py-3.5 text-slate-400">{s.email}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              !s.is_approved ? 'bg-warning/10 text-warning' :
                              s.is_active ? 'bg-success/15 text-success' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {!s.is_approved ? 'Awaiting Approval' : s.is_active ? 'Active' : 'Locked'}
                            </span>
                          </td>
                          <td className="py-3.5 font-bold font-mono">{s.current_streak} days</td>
                          <td className="py-3.5 text-right space-x-2">
                            {!s.is_approved && (
                              <button 
                                onClick={() => handleApproveStudent(s.id)}
                                className="px-2 py-1 rounded bg-success/20 text-success text-[10px] font-bold hover:bg-success/30 transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            <button 
                              onClick={() => handleToggleLockStudent(s.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                s.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-success/20 text-success hover:bg-success/30'
                              }`}
                            >
                              {s.is_active ? 'Lock' : 'Unlock'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grading portal */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 space-y-4">
              <h3 className="text-base font-extrabold text-white">Project Review & Grading</h3>
              <p className="text-[10px] text-slate-400">Review student source code repositories and submit grading evaluations.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 font-bold">
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Project ID</th>
                      <th className="py-2.5">Repository URL</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500 italic">No submissions submitted yet.</td>
                      </tr>
                    ) : (
                      submissions.map(sub => (
                        <tr key={sub.id} className="text-slate-300">
                          <td className="py-3 font-semibold text-white">{sub.user ? sub.user.full_name : `Student ID: ${sub.user_id}`}</td>
                          <td className="py-3 font-mono text-[10px] text-slate-400">{sub.project_id}</td>
                          <td className="py-3">
                            <a href={sub.repo_url} target="_blank" rel="noreferrer" className="text-accent hover:underline truncate max-w-[180px] block">
                              {sub.repo_url}
                            </a>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              sub.status === 'approved' ? 'bg-success/15 text-success' :
                              sub.status === 'pending' ? 'bg-warning/15 text-warning' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button 
                              onClick={() => {
                                setSelectedSub(sub);
                                setGradeStatus(sub.status);
                                setGradeFeedback(sub.instructor_feedback || '');
                              }}
                              className="px-2.5 py-1 rounded bg-primary/20 text-white text-[10px] font-bold hover:bg-primary/30 transition cursor-pointer"
                            >
                              Grade
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT AREA: WHITELIST & ANNOUNCEMENTS (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Whitelist Panel */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Registration Whitelist</h3>
                <p className="text-[10px] text-slate-400">Only emails added to this list will bypass admin moderation and auto-approve.</p>
              </div>

              <form onSubmit={handleAddToWhitelist} className="flex gap-2">
                <input 
                  type="email"
                  required
                  placeholder="student@allowed.com"
                  className="flex-grow px-3 py-2 glass-input text-xs"
                  value={whitelistEmail}
                  onChange={(e) => setWhitelistEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Add
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {whitelist.map(entry => (
                  <div key={entry.id} className="flex justify-between items-center p-2 bg-slate-900/60 border border-white/5 rounded-xl text-xs">
                    <span className="truncate max-w-[150px] font-mono text-slate-300">{entry.email}</span>
                    <button 
                      onClick={() => handleDeleteFromWhitelist(entry.email)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements Panel */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Post Announcement</h3>
                <p className="text-[10px] text-slate-400">Push global notification popups to all student feeds.</p>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Day 2 projects details"
                    className="w-full px-3 py-2 glass-input text-xs"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Message Content</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Provide details about the announcements..."
                    className="w-full px-3 py-2 glass-input text-xs"
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-primary to-accent text-slate-900 font-bold text-xs rounded-xl hover:shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} /> Send Announcement
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>

      {/* REVIEW GRADING MODAL POPUP */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-white/5 max-w-md w-full relative space-y-4">
            
            <button 
              onClick={() => setSelectedSub(null)}
              className="absolute top-4 right-4 text-slate-450 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-white">Review Submission</h3>
            <p className="text-xs text-slate-400">Review candidate code output and select approval marks.</p>

            <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div><strong className="text-slate-400">Project:</strong> {selectedSub.project_id}</div>
              <div><strong className="text-slate-400">Student Name:</strong> {selectedSub.user ? selectedSub.user.full_name : selectedSub.user_id}</div>
              <div>
                <strong className="text-slate-400 font-medium block">Repository:</strong> 
                <a href={selectedSub.repo_url} target="_blank" rel="noreferrer" className="text-accent hover:underline block break-all">{selectedSub.repo_url}</a>
              </div>
              {selectedSub.notes && (
                <div>
                  <strong className="text-slate-400">Submission Notes:</strong>
                  <p className="text-slate-400 italic text-[11px] mt-1 bg-slate-900 p-2 rounded">"{selectedSub.notes}"</p>
                </div>
              )}
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Review Evaluation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGradeStatus('approved')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      gradeStatus === 'approved' 
                        ? 'bg-success/20 border-success text-success' 
                        : 'bg-slate-950 border-white/5 text-slate-400'
                    }`}
                  >
                    ✓ Approve Submission
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradeStatus('rejected')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      gradeStatus === 'rejected' 
                        ? 'bg-red-500/20 border-red-500 text-red-400' 
                        : 'bg-slate-950 border-white/5 text-slate-400'
                    }`}
                  >
                    ✕ Request Re-submit
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Written Feedback</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Provide feedback on their code implementation, suggestions for improvements, etc."
                  className="w-full px-3 py-2 glass-input text-xs"
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition cursor-pointer"
                >
                  Save Review
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
