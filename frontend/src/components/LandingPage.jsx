import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  ArrowRight, BookOpen, CheckCircle, Code2, Shield,
  Terminal, Zap, Users, Trophy, Star, Play, ChevronRight
} from 'lucide-react';

const TECH_BADGES = [
  { name: 'Gemini', color: '#4285F4', emoji: '♊' },
  { name: 'LangChain', color: '#00D4FF', emoji: '🔗' },
  { name: 'RAG', color: '#8B4CF7', emoji: '🗄️' },
  { name: 'LangGraph', color: '#34D978', emoji: '🕸️' },
  { name: 'CrewAI', color: '#FBBF24', emoji: '🤖' },
  { name: 'MCP', color: '#F97316', emoji: '🔌' },
];

export default function LandingPage({ onNavigate, onRegisterSuccess }) {
  const [formData, setFormData] = useState({ email: '', fullName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeDay, setActiveDay] = useState(1);
  const [badgeIdx, setBadgeIdx] = useState(0);

  // Cycle tech badge highlights
  useEffect(() => {
    const t = setInterval(() => setBadgeIdx(i => (i + 1) % TECH_BADGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = await api.register(formData.email, formData.fullName, formData.password);
      if (user.is_approved) {
        setSuccess('Registration successful! Auto-approved ✓ Redirecting to login…');
        setTimeout(() => {
          onRegisterSuccess(formData.email);
          onNavigate('login');
        }, 1800);
      } else {
        setSuccess('Registration submitted! Awaiting administrator approval.');
        setFormData({ email: '', fullName: '', password: '' });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const syllabus = {
    1: {
      title: 'Build Your First AI Applications',
      color: '#6B6FF5',
      icon: '🚀',
      topics: [
        { title: 'GenAI, ML, DL & LLMs', desc: 'Trace the evolution from AI to modern transformer models.' },
        { title: 'Gemini API Integration', desc: 'API keys, SDK setup, text/chat/vision capabilities.' },
        { title: 'Prompt Engineering', desc: 'Few-shot, Chain of Thought, structured JSON outputs.' },
        { title: 'Streamlit UI', desc: 'Build interactive AI chat apps in Python — no JS needed.' },
        { title: 'LangChain Foundations', desc: 'Prompts, chains, memory, LCEL pipe syntax.' },
        { title: '🛠️ Mini-Project', desc: 'AI Resume & Job Fit Analyzer with Streamlit.' },
      ],
    },
    2: {
      title: 'Knowledge Assistants & Stateful Flows',
      color: '#8B4CF7',
      icon: '🧠',
      topics: [
        { title: 'Retrieval-Augmented Generation', desc: 'Embeddings, chunking, vector retrieval pipelines.' },
        { title: 'Vector Databases — ChromaDB', desc: 'Store, query, and filter semantic knowledge bases.' },
        { title: 'LangGraph State Machines', desc: 'Nodes, edges, shared state, conditional routing.' },
        { title: 'CrewAI Multi-Agent Systems', desc: 'Role-playing agents, tasks, hierarchical crews.' },
        { title: '🛠️ Mini-Project', desc: 'University Academic Regulation Assistant (RAG + Streamlit).' },
      ],
    },
    3: {
      title: 'Build Intelligent Autonomous Agents',
      color: '#00E0FF',
      icon: '🤖',
      topics: [
        { title: 'Model Context Protocol (MCP)', desc: 'Client, server, tools, resources — the agentic OS.' },
        { title: 'Agentic AI Principles', desc: 'Planning, memory, reflection, and tool-calling loops.' },
        { title: 'Agentic RAG', desc: 'Self-correcting retrieval loops and web fallback search.' },
        { title: '🛠️ Capstone Project', desc: 'Autonomous Student Academic Advisor Agent (LangGraph + RAG).' },
      ],
    },
  };

  const stats = [
    { value: '3', label: 'Intensive Days', icon: '📅' },
    { value: '15+', label: 'Hands-on Topics', icon: '📚' },
    { value: '3', label: 'Real Projects', icon: '💻' },
    { value: '100%', label: 'Python Focused', icon: '🐍' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-15%] left-[-8%] w-[55vw] h-[55vw] rounded-full bg-primary/8 blur-[120px] animate-glow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-8%] w-[45vw] h-[45vw] rounded-full bg-accent/8 blur-[100px] animate-glow pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[25vw] h-[25vw] rounded-full bg-secondary/6 blur-[80px] pointer-events-none" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/8 py-4 px-6 md:px-14 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-2xl shadow-lg shadow-primary/25">
            🤖
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none">AGENTIC 003</span>
            <span className="text-xs text-accent tracking-widest uppercase font-bold">LMS Platform</span>
          </div>
        </div>

        {/* Animated tech badges */}
        <div className="hidden md:flex items-center gap-2">
          {TECH_BADGES.map((b, i) => (
            <span
              key={b.name}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all duration-500"
              style={{
                background: i === badgeIdx ? `${b.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === badgeIdx ? b.color + '66' : 'rgba(255,255,255,0.08)'}`,
                color: i === badgeIdx ? b.color : '#7A8EB8',
                transform: i === badgeIdx ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {b.emoji} {b.name}
            </span>
          ))}
        </div>

        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 text-white"
        >
          Student Login
        </button>
      </header>

      {/* ── HERO + REGISTER ── */}
      <main className="flex-grow max-w-8xl mx-auto px-6 md:px-14 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center relative z-10 w-full">

        {/* Left: Hero */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/12 border border-primary/25 text-sm font-bold text-accent">
            <Zap size={16} className="animate-bounce text-warning" />
            3-Day Intensive Hands-on Workshop • July 2026
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white tracking-tight">
            Programming Autonomous AI Agents with{' '}
            <span className="text-gradient-purple">RAG, MCP</span>{' '}
            &amp; LLMs
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
            A coding-focused workshop where participants design, build, and deploy intelligent AI agents using modern
            <strong className="text-white"> LLMs</strong>,
            <strong className="text-white"> Retrieval-Augmented Generation (RAG)</strong>,
            <strong className="text-white"> Model Context Protocol (MCP)</strong>, and enterprise AI frameworks. Gain hands-on experience through real-world programming exercises, guided labs, and production-ready projects.
          </p>

          {/* Colorful image */}
          <div className="rounded-2xl border-2 border-white/15 overflow-hidden shadow-2xl relative max-w-2xl bg-card-dark/70 p-1">
            <img src="/hero.png" alt="Agentic AI Workshop" className="w-full h-auto object-cover max-h-72 rounded-xl opacity-95 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/50 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-card-dark/60 border border-white/8 text-center hover:border-primary/30 transition card-hover">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              '✅ Completion Certificate',
              '✅ Real Project Portfolio',
              '✅ Code Templates Included',
              '✅ Lifetime Access to Materials',
              '✅ Expert Instructor Q&A',
            ].map((f, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-success/10 border border-success/25 text-success text-xs font-semibold">
                {f}
              </span>
            ))}
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-slate-900 font-black text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
          >
            <Play size={18} fill="currentColor" /> Access the LMS Portal
          </button>
        </div>

        {/* Right: Register Card */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent/8 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Register for Workshop</h3>
                  <p className="text-xs text-slate-400">Create your student access account</p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 mb-5 rounded-xl bg-red-500/12 border border-red-500/25 text-sm text-red-300 font-medium">
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div className="p-3.5 mb-5 rounded-xl bg-success/12 border border-success/25 text-sm text-success font-semibold">
                  ✓ {success}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'e.g. Priya Sharma' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'name@company.com' },
                  { label: 'Password', key: 'password', type: 'password', placeholder: 'Create a strong password' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-sm text-slate-300 font-semibold mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 glass-input text-sm"
                      value={formData[field.key]}
                      onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 text-slate-900 font-black text-base transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />Registering...</>
                  ) : (
                    <>Claim My Seat <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-white/8 text-center">
                <span className="text-sm text-slate-400">Already registered? </span>
                <button onClick={() => onNavigate('login')} className="text-sm text-accent font-bold hover:underline">
                  Login here →
                </button>
              </div>


            </div>
          </div>
        </div>
      </main>

      {/* ── SYLLABUS SECTION ── */}
      <section className="border-t border-white/8 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/12 border border-primary/25 text-sm font-bold text-accent mb-4">
              📋 Full Curriculum Roadmap
            </span>
            <h2 className="text-4xl font-black text-white mb-3">3-Day Learning Journey</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every day builds on the last — from foundations to fully autonomous AI agents.
            </p>
          </div>

          {/* Day tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3].map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className="px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                style={{
                  background: activeDay === day ? `linear-gradient(135deg, ${syllabus[day].color}33, ${syllabus[day].color}22)` : 'rgba(26,36,64,0.6)',
                  border: `1.5px solid ${activeDay === day ? syllabus[day].color + '66' : 'rgba(255,255,255,0.08)'}`,
                  color: activeDay === day ? '#FFFFFF' : '#A8B8D8',
                  boxShadow: activeDay === day ? `0 0 24px ${syllabus[day].color}30` : 'none',
                }}
              >
                {syllabus[day].icon} Day {day}
              </button>
            ))}
          </div>

          {/* Active day card */}
          <div
            className="glass-panel p-8 rounded-3xl relative overflow-hidden transition-all duration-500"
            style={{ borderColor: syllabus[activeDay].color + '33' }}
          >
            <div
              className="absolute top-0 right-0 w-48 h-48 blur-3xl rounded-full opacity-20"
              style={{ background: syllabus[activeDay].color }}
            />

            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: syllabus[activeDay].color + '22', border: `1.5px solid ${syllabus[activeDay].color}44` }}
              >
                {syllabus[activeDay].icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: syllabus[activeDay].color }}>
                  Day {activeDay} of 3
                </span>
                <h3 className="text-2xl font-black text-white">{syllabus[activeDay].title}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {syllabus[activeDay].topics.map((topic, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border transition hover:-translate-y-0.5 duration-200"
                  style={{
                    background: `${syllabus[activeDay].color}08`,
                    borderColor: `${syllabus[activeDay].color}22`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                      style={{ background: syllabus[activeDay].color + '30', color: syllabus[activeDay].color }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{topic.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{topic.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COORDINATORS & RESOURCE PERSONS ── */}
      <section className="border-t border-white/8 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/12 border border-secondary/25 text-sm font-bold text-accent mb-4">
              👥 Workshop Team
            </span>
            <h2 className="text-4xl font-black text-white mb-3">Coordinators &amp; Resource Person</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Led by industry experts and academic leaders bringing real-world AI experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coordinator Card */}
            <div
              className="p-8 rounded-3xl border-2 transition-all duration-300 card-hover relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(107, 111, 245, 0.25) 0%, rgba(124, 58, 237, 0.2) 100%)', borderColor: 'rgba(107, 111, 245, 0.65)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ background: 'rgba(107, 111, 245, 0.35)', border: '2px solid rgba(107, 111, 245, 0.6)' }}
                  >
                    🎓
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-accent block mb-1">Workshop Coordinator</span>
                    <h3 className="text-2xl font-black text-white">Dr. Hema Vaidyanathan</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-extrabold"
                    style={{ background: 'rgba(107, 111, 245, 0.3)', border: '1.5px solid rgba(107, 111, 245, 0.55)', color: '#FFFFFF' }}
                  >
                    🏢 ByteXL
                  </span>
                </div>
              </div>
            </div>

            {/* Resource Person Card */}
            <div
              className="p-8 rounded-3xl border-2 transition-all duration-300 card-hover relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(0, 224, 255, 0.2) 0%, rgba(107, 111, 245, 0.2) 100%)', borderColor: 'rgba(0, 224, 255, 0.6)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ background: 'rgba(0, 224, 255, 0.25)', border: '2px solid rgba(0, 224, 255, 0.5)' }}
                  >
                    🔬
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-accent block mb-1">Resource Person</span>
                    <h3 className="text-2xl font-black text-white">Dr. Karunakar Pothuganti</h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(0, 224, 255, 0.25)', border: '1.5px solid rgba(0, 224, 255, 0.5)', color: '#FFFFFF' }}
                  >
                    M.Tech · Ph.D · MBA · PGDES
                  </span>
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(52, 217, 120, 0.25)', border: '1.5px solid rgba(52, 217, 120, 0.5)', color: '#FFFFFF' }}
                  >
                    📊 Data Scientist
                  </span>
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(251, 191, 36, 0.25)', border: '1.5px solid rgba(251, 191, 36, 0.5)', color: '#FFFFFF' }}
                  >
                    🎨 Head of Instructional Design
                  </span>
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(107, 111, 245, 0.25)', border: '1.5px solid rgba(107, 111, 245, 0.5)', color: '#FFFFFF' }}
                  >
                    🏢 ByteXL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS WORKSHOP ── */}
      <section className="border-t border-white/8 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-14">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-3">Why AGENTIC 003?</h2>
            <p className="text-slate-400 text-base">Built by engineers, for engineers who want to ship real AI products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                color: '#FBBF24',
                title: 'Hands-on from Day 1',
                desc: 'No slideshow theory — every concept is immediately applied in a real coding exercise or project.',
              },
              {
                icon: '🏗️',
                color: '#6B6FF5',
                title: 'Production-Ready Code',
                desc: 'Learn patterns used by top AI startups: RAG pipelines, agentic loops, and MCP server integrations.',
              },
              {
                icon: '🏆',
                color: '#34D978',
                title: 'Verified Certificate',
                desc: 'Complete the capstone project and receive a verifiable digital certificate with a unique credential ID.',
              },
              {
                icon: '🤝',
                color: '#00E0FF',
                title: 'Expert Mentorship',
                desc: 'Direct Q&A sessions with instructors who have shipped AI products at scale.',
              },
              {
                icon: '📦',
                color: '#F97316',
                title: 'Complete Starter Kits',
                desc: 'Walk away with 6+ Python project templates, datasets, and deployment guides.',
              },
              {
                icon: '♾️',
                color: '#8B4CF7',
                title: 'Lifetime Material Access',
                desc: 'All lesson notes, code, and recordings are available after the workshop ends.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border transition-all duration-300 card-hover cursor-default"
                style={{
                  background: `${f.color}08`,
                  borderColor: `${f.color}22`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: f.color + '20', border: `1.5px solid ${f.color}33` }}
                >
                  {f.icon}
                </div>
                <h4 className="text-base font-extrabold text-white mb-2">{f.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="border-t border-white/8 py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-14 text-center space-y-6">
          <h2 className="text-4xl font-black text-white">Ready to Build Agentic AI?</h2>
          <p className="text-slate-400 text-lg">Join the workshop and start shipping intelligent applications this week.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('register-top')?.scrollIntoView({ behavior: 'smooth' }) || onNavigate('login')}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-slate-900 font-black text-base hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              🚀 Enroll Now — It's Free
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-10 py-4 rounded-2xl bg-card-dark/60 border border-white/10 text-white font-bold text-base hover:bg-card-dark transition-all duration-300"
            >
              Already enrolled? Login →
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 md:px-14 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="font-bold text-slate-400">AGENTIC 003 LMS</span>
        </div>
        <p>© 2026 AGENTIC 003 Workshop &nbsp;|&nbsp; <span className="text-slate-300 font-semibold">ByteXL TechED Pvt. Ltd.</span></p>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="ml-1">Premium EdTech Platform</span>
        </div>
      </footer>
    </div>
  );
}
