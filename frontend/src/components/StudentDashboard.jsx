import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { 
  Award, BookOpen, Bookmark, FileText, 
  Download, LogOut, Flame, Play, CheckCircle, 
  Lock, Calendar, ChevronRight, Trophy, Sparkles,
  Terminal, Database, Network, Cpu, Crown
} from 'lucide-react';

export default function StudentDashboard({ user, onLogout, onStartLesson, onNavigate }) {
  const [stats, setStats] = useState({
    completedCount: 0,
    totalTopics: 14, // Day 1: 5 topics, Day 2: 4 topics, Day 3: 3 topics + 2 mini projects + 1 capstone
    percent: 0,
    streak: user.current_streak || 1,
  });
  const [progressList, setProgressList] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        const prog = await api.getProgress();
        const lead = await api.getLeaderboard();
        const ann = await api.getAnnouncements();
        const proj = await api.getUserProjects();
        setProgressList(prog);
        setLeaderboard(lead);
        setAnnouncements(ann);
        setProjects(proj);
        
        // Calculate progress percentage
        // Total items to complete: 11 topics + 2 mini-projects + 1 capstone = 14
        const completed = prog.filter(p => p.completed).length;
        setStats(prev => ({
          ...prev,
          completedCount: completed,
          percent: Math.min(Math.round((completed / prev.totalTopics) * 100), 100)
        }));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Evaluate certificate eligibility
  // Student qualifies if they completed all 14 items (or 100% completion) and capstone is approved
  const isCapstoneApproved = projects.some(p => p.project_id === 'day3_project' && p.status === 'approved');
  const isEligibleForCertificate = stats.percent >= 90 || (stats.percent >= 70 && isCapstoneApproved);

  // Badges check
  const hasBadge = (badgeName) => {
    switch (badgeName) {
      case 'prompt_engineer':
        return progressList.some(p => p.topic_id === 'advanced_techniques' && p.completed);
      case 'rag_master':
        return progressList.some(p => p.topic_id === 'rag_concepts' && p.completed);
      case 'graph_wizard':
        return progressList.some(p => p.topic_id === 'langgraph_foundations' && p.completed);
      case 'mcp_architect':
        return progressList.some(p => p.topic_id === 'mcp_architecture' && p.completed);
      case 'ai_overlord':
        return isCapstoneApproved;
      default:
        return false;
    }
  };

  const getProjectStatus = (projId) => {
    const proj = projects.find(p => p.project_id === projId);
    if (!proj) return 'not_submitted';
    return proj.status; // 'pending', 'approved', 'rejected'
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden pb-12">
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-accent/10 blur-[100px] pointer-events-none"></div>

      {/* Nav */}
      <nav className="glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-slate-900 text-base">
            🤖
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">AGENTIC 003</span>
            <span className="text-[9px] text-accent tracking-widest uppercase font-semibold">Student Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user.role === 'admin' && (
            <button 
              onClick={() => onNavigate('admin_panel')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-card-dark border border-primary/20 text-accent hover:border-primary transition"
            >
              Admin Dashboard
            </button>
          )}
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-white block">{user.full_name}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{user.email}</span>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white transition hover:bg-slate-800"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full">
        
        {/* LEFT COLUMN: Welcome, Stats, Curriculum Roadmap */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-2xl rounded-full"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Class of 2026</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span className="text-[10px] text-success font-semibold">Workshop Active</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Welcome back, {user.full_name.split(' ')[0]}!
                </h1>
                <p className="text-slate-400 text-xs md:text-sm">
                  "The best way to predict the future is to build autonomous agents that code it for you."
                </p>
              </div>

              {/* Streak info */}
              <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 px-4 py-3 rounded-2xl">
                <Flame size={28} className="text-orange-500 fill-orange-500 animate-pulse" />
                <div>
                  <span className="text-xl font-black text-white block leading-none">{stats.streak} Days</span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Learning Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Completion Progress Ring */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 flex items-center justify-between gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                  <circle cx="32" cy="32" r="26" stroke="#5B5FEF" strokeWidth="4" fill="transparent"
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * stats.percent) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">{stats.percent}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Course Progress</span>
                <span className="text-base font-extrabold text-white">{stats.completedCount} / {stats.totalTopics} completed</span>
              </div>
            </div>

            {/* Badges Earned */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                <Award size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Skills Earned</span>
                <span className="text-base font-extrabold text-white">
                  {[ 'prompt_engineer', 'rag_master', 'graph_wizard', 'mcp_architect' ].filter(hasBadge).length} Skill Badges
                </span>
              </div>
            </div>

            {/* Certificate Widget */}
            <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isEligibleForCertificate ? 'bg-success/10 text-success' : 'bg-slate-800 text-slate-500'
              }`}>
                <Trophy size={24} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Certificate Status</span>
                {isEligibleForCertificate ? (
                  <button 
                    onClick={() => setShowCertificate(true)}
                    className="text-xs text-success font-black hover:underline flex items-center gap-1 mt-0.5"
                  >
                    Claim Certificate <Sparkles size={12} className="animate-spin" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-bold block">Ineligible (Complete Capstone)</span>
                )}
              </div>
            </div>
          </div>

          {/* Curriculum Roadmap Card */}
          <div className="p-6 rounded-3xl bg-card-dark/40 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" /> Learning Journey & Syllabus
            </h3>

            <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              
              {/* Day 1: Build Your First AI Applications */}
              <div className="relative pl-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Node icon */}
                <div className="absolute left-3 w-6 h-6 rounded-full bg-success flex items-center justify-center border-4 border-bg-dark text-white text-[9px] font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Day 1: Build Your First AI Applications
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Foundations, Gemini SDK, Prompts, Streamlit & LangChain.</p>
                  
                  {/* Day 1 Mini Project status */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Project: AI Resume Analyzer</span>
                    {getProjectStatus('day1_project') === 'approved' ? (
                      <span className="text-[9px] text-success font-semibold flex items-center gap-1">✓ Approved</span>
                    ) : getProjectStatus('day1_project') === 'pending' ? (
                      <span className="text-[9px] text-warning font-semibold">⏳ Grading Pending</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-semibold">Not submitted</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onStartLesson('day1', 'intro_genai')}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Play size={12} fill="white" /> Enter Player
                </button>
              </div>

              {/* Day 2: Knowledge Assistants */}
              <div className="relative pl-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Node icon */}
                <div className="absolute left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-4 border-bg-dark text-white text-[9px] font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Day 2: Knowledge Assistants & Graphs
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">RAG, ChromaDB, LangGraph State Machines & CrewAI Crew.</p>
                  
                  {/* Day 2 Mini Project status */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Project: University Regulation Assistant</span>
                    {getProjectStatus('day2_project') === 'approved' ? (
                      <span className="text-[9px] text-success font-semibold flex items-center gap-1">✓ Approved</span>
                    ) : getProjectStatus('day2_project') === 'pending' ? (
                      <span className="text-[9px] text-warning font-semibold">⏳ Grading Pending</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-semibold">Not submitted</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onStartLesson('day2', 'rag_concepts')}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Play size={12} fill="white" /> Enter Player
                </button>
              </div>

              {/* Day 3: Build Intelligent Agents */}
              <div className="relative pl-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Node icon */}
                <div className="absolute left-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center border-4 border-bg-dark text-white text-[9px] font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Day 3: Build Intelligent Agents
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Model Context Protocol (MCP), Agentic Loops & Agentic RAG.</p>
                  
                  {/* Day 3 Capstone status */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Capstone: Student Academic Advisor</span>
                    {isCapstoneApproved ? (
                      <span className="text-[9px] text-success font-semibold flex items-center gap-1">✓ Approved</span>
                    ) : getProjectStatus('day3_project') === 'pending' ? (
                      <span className="text-[9px] text-warning font-semibold">⏳ Grading Pending</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-semibold">Not submitted</span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onStartLesson('day3', 'mcp_architecture')}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/80 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Play size={12} fill="white" /> Enter Player
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Announcements, Leaderboard, Badges */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Announcements Widget */}
          <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-accent" /> Announcements
            </h3>
            <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">No notifications yet.</div>
              ) : (
                announcements.map((ann, i) => (
                  <div key={i} className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white block">{ann.title}</span>
                      <span className="text-[8px] text-slate-500 shrink-0">{new Date(ann.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{ann.content}</p>
                    <span className="text-[9px] text-accent font-semibold block pt-1">— {ann.author_name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Badges Grid Widget */}
          <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5">
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Award size={18} className="text-yellow-400" /> Earned Skill Badges
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'prompt_engineer', title: 'Prompt Engineer', icon: Terminal, desc: 'Day 1 Prompts',   color: '#8B5CF6', glow: 'rgba(139,92,246,0.30)' },
                { key: 'rag_master',      title: 'RAG Master',      icon: Database, desc: 'Knowledge Bases', color: '#06B6D4', glow: 'rgba(6,182,212,0.30)'   },
                { key: 'graph_wizard',    title: 'Graph Wizard',    icon: Network,  desc: 'LangGraph Loops', color: '#10B981', glow: 'rgba(16,185,129,0.30)'  },
                { key: 'mcp_architect',   title: 'MCP Architect',   icon: Cpu,      desc: 'Model Contexts',  color: '#F97316', glow: 'rgba(249,115,22,0.30)'  },
                { key: 'ai_overlord',     title: 'AI Overlord',     icon: Crown,    desc: 'Capstone Pass',   color: '#F59E0B', glow: 'rgba(245,158,11,0.30)'  },
              ].map(badge => {
                const active = hasBadge(badge.key);
                const IconComponent = badge.icon;
                return (
                  <div
                    key={badge.key}
                    className="p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all duration-300 cursor-default"
                    style={active ? {
                      background: `linear-gradient(135deg, ${badge.color}1A, ${badge.color}08)`,
                      borderColor: `${badge.color}60`,
                      boxShadow: `0 0 24px ${badge.glow}, inset 0 0 20px ${badge.color}08`,
                    } : {
                      background: 'rgba(15,23,42,0.55)',
                      borderColor: 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Badge Image */}
                    <div className="relative mb-3">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 mx-auto"
                        style={active ? {
                          background: `${badge.color}20`,
                          border: `2px solid ${badge.color}`,
                          boxShadow: `0 0 15px ${badge.color}80`,
                          transform: 'scale(1.05)',
                        } : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '2px solid rgba(255,255,255,0.1)',
                          transform: 'scale(0.92)',
                        }}
                      >
                        <IconComponent 
                          size={32} 
                          color={active ? badge.color : '#4B5563'} 
                          style={active ? { filter: `drop-shadow(0 0 8px ${badge.color})` } : {}}
                        />
                      </div>
                      {active && (
                        <span
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                          style={{ background: badge.color, color: '#0a0f1e', boxShadow: `0 0 8px ${badge.color}` }}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <span
                      className="text-sm font-black block leading-tight"
                      style={{ color: active ? badge.color : '#4B5563' }}
                    >
                      {badge.title}
                    </span>

                    {/* Description */}
                    <span
                      className="text-xs font-semibold block mt-0.5"
                      style={{ color: active ? `${badge.color}BB` : '#374151' }}
                    >
                      {badge.desc}
                    </span>

                    {/* Status pill */}
                    <span
                      className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={active ? {
                        background: `${badge.color}22`,
                        color: badge.color,
                        border: `1px solid ${badge.color}44`,
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        color: '#374151',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {active ? 'Unlocked ✓' : 'Locked 🔒'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Widget */}
          <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" /> Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2">Calculating rankings...</div>
              ) : (
                leaderboard.map((lead, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        idx === 1 ? 'bg-slate-300/20 text-slate-300' :
                        idx === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200">{lead.full_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400">{lead.lessons_completed} lessons</span>
                      <span className="font-bold text-accent font-mono">{lead.quiz_average}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Handy Downloads */}
          <div className="p-6 rounded-2xl bg-card-dark/40 border border-white/5">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3">Resources & Handouts</h3>
            <div className="space-y-2">
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-slate-900/60 border border-white/5 rounded-xl flex justify-between items-center hover:bg-slate-900 transition text-xs font-semibold"
              >
                <span>🔑 Google AI Studio Keys</span>
                <ChevronRight size={14} className="text-slate-500" />
              </a>
              <a 
                href="https://github.com/langchain-ai/langgraph" 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-slate-900/60 border border-white/5 rounded-xl flex justify-between items-center hover:bg-slate-900 transition text-xs font-semibold"
              >
                <span>🕸️ LangGraph Repository</span>
                <ChevronRight size={14} className="text-slate-500" />
              </a>
              <button 
                onClick={() => alert('Download Bundle: code templates and datasets zip triggered. (MOCKED)')}
                className="w-full p-2.5 bg-slate-900/60 border border-white/5 rounded-xl flex justify-between items-center hover:bg-slate-900 transition text-xs font-semibold text-left"
              >
                <span>📦 Core Python Templates.zip</span>
                <Download size={14} className="text-slate-500" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* RENDER CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="bg-slate-900 p-8 rounded-3xl border border-yellow-500/30 max-w-4xl w-full text-center relative space-y-6">
            
            <button 
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Certificate Render container */}
            <div className="p-8 border-8 border-double border-yellow-600 bg-slate-950 text-slate-100 rounded-xl relative shadow-2xl">
              {/* Background watermark logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <span className="text-9xl">🤖</span>
              </div>

              <div className="text-yellow-600 font-extrabold text-sm uppercase tracking-widest mb-4">Certificate of Completion</div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-white italic tracking-wide">AGENTIC 003</h2>
              
              <div className="w-24 h-0.5 bg-yellow-600 mx-auto my-4"></div>
              
              <p className="text-slate-400 text-xs italic">This is to certify that student</p>
              
              <h3 className="text-2xl md:text-3xl font-black text-yellow-500 font-serif my-4 tracking-wider">{user.full_name}</h3>
              
              <p className="text-slate-300 text-xs max-w-lg mx-auto leading-relaxed">
                has successfully completed the intensive 3-Day Hands-on Workshop on building intelligent 
                Agentic Applications using <strong>Gemini</strong>, <strong>LangChain</strong>, 
                <strong>RAG</strong>, <strong>LangGraph</strong>, <strong>CrewAI</strong>, 
                and the <strong>Model Context Protocol (MCP)</strong>.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5 text-[10px] text-slate-400">
                <div className="text-left pl-6">
                  <span className="block font-semibold">DATE OF ISSUANCE:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="text-right pr-6">
                  <span className="block font-semibold">VERIFICATION KEY:</span>
                  <span className="text-accent font-mono">CRED-AG003-{user.id}-{Math.floor(Math.random() * 89999 + 10000)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 text-xs font-bold hover:shadow-lg transition cursor-pointer"
              >
                Print / Save PDF
              </button>
              <button 
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
