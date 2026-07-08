import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../utils/api';
import { renderDiagram } from './Diagrams';
import {
  ArrowLeft, BookOpen, Bookmark, FileText,
  HelpCircle, Code2, ChevronLeft, ChevronRight,
  Play, Check, Award, Copy, Save, AlertCircle, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CoursePlayer({ user, initialDay, initialTopicId, onBackToDashboard }) {
  const [lessons, setLessons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeDay, setActiveDay] = useState(initialDay || 'day1');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson', 'quiz', 'project'

  // User tracking states
  const [progressList, setProgressList] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // Playground Code Editor state
  const [codeValue, setCodeValue] = useState('# Type your Python code here...\nprint("Hello Agentic AI!")');
  const [terminalOutput, setTerminalOutput] = useState('Click "Run Code" to view output.');
  const [isRunning, setIsRunning] = useState(false);

  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  // Project Submission states
  const [projectForm, setProjectForm] = useState({ repoUrl: '', hostedUrl: '', notes: '' });
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectStatus, setProjectStatus] = useState('not_submitted');
  const [projectFeedback, setProjectFeedback] = useState('');

  // Sidebar collapsed (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ─── Load curriculum ────────────────────────────────────────────────────────
  const loadContent = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const curriculum = await api.getLessons();
      if (!curriculum || typeof curriculum !== 'object') {
        throw new Error('Invalid curriculum data received.');
      }
      setLessons(curriculum);

      const prog = await api.getProgress();
      setProgressList(prog || []);
      const bms = await api.getBookmarks();
      setBookmarks(bms || []);

      // Navigate to initialTopicId if provided
      if (initialTopicId && curriculum[initialDay || 'day1']) {
        const dayData = curriculum[initialDay || 'day1'];
        outerLoop:
        for (let mIdx = 0; mIdx < dayData.modules.length; mIdx++) {
          const mod = dayData.modules[mIdx];
          for (let tIdx = 0; tIdx < mod.topics.length; tIdx++) {
            if (mod.topics[tIdx].id === initialTopicId) {
              setActiveModuleIndex(mIdx);
              setActiveTopicIndex(tIdx);
              break outerLoop;
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading curriculum:', err);
      setLoadError(err.message || 'Failed to load lesson content.');
    } finally {
      setLoading(false);
    }
  }, [initialDay, initialTopicId]);

  useEffect(() => { loadContent(); }, [loadContent]);

  // ─── Guard: ensure activeDay data exists ───────────────────────────────────
  useEffect(() => {
    if (!lessons) return;
    if (!lessons[activeDay]) {
      // Fallback to first available day
      const firstDay = Object.keys(lessons)[0];
      if (firstDay) setActiveDay(firstDay);
    }
  }, [lessons, activeDay]);

  // ─── Load note for active topic ────────────────────────────────────────────
  useEffect(() => {
    if (!lessons || !lessons[activeDay]) return;
    const dayData = lessons[activeDay];
    if (!dayData.modules || !dayData.modules[activeModuleIndex]) return;
    const mod = dayData.modules[activeModuleIndex];
    if (!mod.topics || !mod.topics[activeTopicIndex]) return;
    const currentTopic = mod.topics[activeTopicIndex];

    async function loadNote() {
      try {
        const note = await api.getNote(mod.id, currentTopic.id);
        setNoteContent(note?.content || '');
      } catch { setNoteContent(''); }
    }
    loadNote();

    // Reset tabs
    setActiveTab('lesson');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setNoteSaved(false);

    // Load project status
    const projId = `${activeDay}_project`;
    async function checkProject() {
      try {
        const userProjs = await api.getUserProjects();
        const pSub = (userProjs || []).find(p => p.project_id === projId);
        if (pSub) {
          setProjectForm({ repoUrl: pSub.repo_url || '', hostedUrl: pSub.hosted_url || '', notes: pSub.notes || '' });
          setProjectStatus(pSub.status || 'not_submitted');
          setProjectFeedback(pSub.instructor_feedback || '');
        } else {
          setProjectForm({ repoUrl: '', hostedUrl: '', notes: '' });
          setProjectStatus('not_submitted');
          setProjectFeedback('');
        }
      } catch { /* silent */ }
    }
    checkProject();

    // Set code template based on topic
    const tid = currentTopic.id || '';
    if (tid.includes('mcp')) {
      setCodeValue(`from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP("LMS Server")\n\n@mcp.tool()\ndef fetch_notes() -> str:\n    return "Saved notes!"\n\nif __name__ == "__main__":\n    mcp.run()`);
    } else if (tid.includes('langgraph')) {
      setCodeValue(`from langgraph.graph import StateGraph, START, END\n\nworkflow = StateGraph(dict)\nworkflow.add_node("process", lambda x: {"value": 1})\nworkflow.add_edge(START, "process")\nworkflow.add_edge("process", END)\n\napp = workflow.compile()\nresult = app.invoke({})\nprint("LangGraph compiled!", result)`);
    } else if (tid.includes('rag') || tid.includes('chroma')) {
      setCodeValue(`import chromadb\n\nclient = chromadb.Client()\ncollection = client.get_or_create_collection("workshop")\n\ncollection.add(\n    documents=["AI agents are autonomous systems."],\n    ids=["doc1"]\n)\n\nresults = collection.query(\n    query_texts=["What are AI agents?"],\n    n_results=1\n)\nprint("Found:", results["documents"][0][0])`);
    } else if (tid.includes('gemini') || tid.includes('sdk') || tid.includes('basics')) {
      setCodeValue(`from google import genai\n\nclient = genai.Client()\n\nresponse = client.models.generate_content(\n    model="gemini-1.5-flash",\n    contents="What is Agentic RAG? Explain in 3 bullet points."\n)\n\nprint(response.text)`);
    } else if (tid.includes('crew')) {
      setCodeValue(`from crewai import Agent, Task, Crew, Process\n\nresearcher = Agent(\n    role="AI Researcher",\n    goal="Find top 3 Agentic AI trends for 2026.",\n    backstory="You are a VC technology analyst.",\n)\n\ntask = Task(\n    description="Research and list 3 Agentic AI trends.",\n    expected_output="A bulleted list.",\n    agent=researcher\n)\n\ncrew = Crew(agents=[researcher], tasks=[task], process=Process.sequential)\nprint("Crew ready to kickoff!")`);
    } else {
      setCodeValue(`# Python Workshop Sandbox\n# Edit and run code here to practice!\n\ndef greet_agent(name):\n    return f"Hello, {name}! You are ready to build Agentic AI."\n\nprint(greet_agent("AGENTIC 003 Student"))`);
    }
  }, [lessons, activeDay, activeModuleIndex, activeTopicIndex]);

  // ─── Loading / Error States ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-primary/30"></div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Loading Workshop Curriculum...</p>
        </div>
      </div>
    );
  }

  if (loadError || !lessons) {
    return (
      <div className="min-h-screen bg-bg-dark text-slate-100 flex items-center justify-center p-8">
        <div className="glass-panel p-8 rounded-3xl border border-red-500/20 max-w-md w-full text-center space-y-4">
          <AlertCircle size={48} className="text-red-400 mx-auto" />
          <h2 className="text-lg font-extrabold text-white">Content Load Failed</h2>
          <p className="text-xs text-slate-400">{loadError || 'No curriculum data available.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={onBackToDashboard} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition">
              ← Back to Dashboard
            </button>
            <button onClick={loadContent} className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/30 transition flex items-center gap-1">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Safe data access ──────────────────────────────────────────────────────
  const dayData = lessons[activeDay];
  if (!dayData || !dayData.modules || dayData.modules.length === 0) {
    return (
      <div className="min-h-screen bg-bg-dark text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-400 text-sm">No content available for {activeDay}.</p>
          <button onClick={onBackToDashboard} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">← Dashboard</button>
        </div>
      </div>
    );
  }

  const safeModIdx = Math.min(activeModuleIndex, dayData.modules.length - 1);
  const activeModule = dayData.modules[safeModIdx];
  const safeTopIdx = Math.min(activeTopicIndex, (activeModule?.topics?.length || 1) - 1);
  const activeTopic = activeModule?.topics?.[safeTopIdx];

  if (!activeTopic) {
    return (
      <div className="min-h-screen bg-bg-dark text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-slate-400 text-sm">Topic not found. Please select a lesson from the sidebar.</p>
          <button onClick={onBackToDashboard} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">← Dashboard</button>
        </div>
      </div>
    );
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const isTopicCompleted = (moduleId, topicId) =>
    progressList.some(p => p.module_id === moduleId && p.topic_id === topicId && p.completed);

  const handleToggleComplete = async () => {
    const isDone = isTopicCompleted(activeModule.id, activeTopic.id);
    try {
      await api.updateProgress(activeModule.id, activeTopic.id, !isDone, 120);
      const prog = await api.getProgress();
      setProgressList(prog || []);
      if (!isDone) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
      }
    } catch (err) { console.error(err); }
  };

  const isBookmarked = bookmarks.some(b => b.module_id === activeModule.id && b.topic_id === activeTopic.id);
  const handleToggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await api.deleteBookmark(activeModule.id, activeTopic.id);
      } else {
        await api.addBookmark(activeModule.id, activeTopic.id);
      }
      const bms = await api.getBookmarks();
      setBookmarks(bms || []);
    } catch (err) { console.error(err); }
  };

  const handleSaveNote = async () => {
    setNoteSaving(true);
    try {
      await api.saveNote(activeModule.id, activeTopic.id, noteContent);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (err) { console.error(err); }
    finally { setNoteSaving(false); }
  };

  // ─── Code runner (simulated) ────────────────────────────────────────────────
  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput('⚡ Initializing Python runtime...\n');
    setTimeout(() => {
      let output = '';
      if (codeValue.includes('genai.Client()') || codeValue.includes('generate_content')) {
        output = '⚡ Calling Gemini 1.5 Flash...\n\n[Gemini Response]:\n"Agentic RAG is a self-correcting retrieval pipeline where the agent:\n• Plans the retrieval strategy\n• Evaluates chunk relevance\n• Rewrites queries if context is insufficient\n• Falls back to web search when local index fails"\n\n✅ Process completed (exit 0)';
      } else if (codeValue.includes('StateGraph') || codeValue.includes('langgraph')) {
        output = '⚡ Compiling LangGraph workflow...\nAdding nodes: [process]\nAdding edges: START → process → END\nGraph compiled successfully!\n\n✅ Result: {"value": 1}\n✅ Process completed (exit 0)';
      } else if (codeValue.includes('FastMCP') || codeValue.includes('mcp')) {
        output = '⚡ Starting FastMCP Server...\nServer name: LMS Server\nRegistered tools: [fetch_notes]\nListening at http://localhost:8000/mcp\n\n✅ Process completed (exit 0)';
      } else if (codeValue.includes('chromadb') || codeValue.includes('collection')) {
        output = '⚡ Connecting to ChromaDB...\nCollection "workshop" ready.\nAdded 1 document.\nQuery: "What are AI agents?"\n\nFound: AI agents are autonomous systems.\nDistance: 0.0821\n\n✅ Process completed (exit 0)';
      } else if (codeValue.includes('crewai') || codeValue.includes('Crew')) {
        output = '⚡ Initializing CrewAI Crew...\nAgent "AI Researcher" loaded.\nTask assigned: "Research and list 3 Agentic AI trends."\n\nCrew ready to kickoff!\n✅ Process completed (exit 0)';
      } else {
        const printMatches = [...codeValue.matchAll(/print\((.+?)\)/g)];
        if (printMatches.length) {
          output = printMatches
            .map(m => m[1].replace(/f?["'`]|["'`]/g, '').replace(/\{.*?\}/g, '<value>'))
            .join('\n');
          output += '\n\n✅ Process completed (exit 0)';
        } else {
          output = '⚡ Script executed.\n\n✅ Process completed with no print output (exit 0)';
        }
      }
      setTerminalOutput(output);
      setIsRunning(false);
    }, 1400);
  };

  // ─── Quiz ───────────────────────────────────────────────────────────────────
  const quizData = dayData.quiz;
  const handleQuizSubmit = async () => {
    if (!quizData?.questions) return;
    let score = 0;
    quizData.questions.forEach(q => {
      if (quizAnswers[q.id] === q.answer) score++;
    });
    const percent = (score / quizData.questions.length) * 100;
    const passed = percent >= 60;
    setQuizScore(score);
    setQuizSubmitted(true);
    try {
      await api.submitQuiz(quizData.id, score, quizData.questions.length, passed);
      const prog = await api.getProgress();
      setProgressList(prog || []);
      if (passed) confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    } catch (err) { console.error(err); }
  };

  // ─── Project ────────────────────────────────────────────────────────────────
  const projectData = dayData.project;
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectSubmitting(true);
    const projId = `${activeDay}_project`;
    try {
      await api.submitProject(projId, projectForm.repoUrl, projectForm.hostedUrl, projectForm.notes);
      setProjectStatus('pending');
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again.');
    } finally {
      setProjectSubmitting(false);
    }
  };

  // ─── Markdown renderer with diagram support ─────────────────────────────────
  const renderTopicContent = (text) => {
    if (!text) return <p className="text-slate-500 text-xs italic">No content available for this topic.</p>;
    const regex = /\[DIAGRAM:\s*(\w+)\s*\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const before = text.substring(lastIndex, match.index);
      if (before) parts.push({ type: 'markdown', content: before });
      parts.push({ type: 'diagram', name: match[1] });
      lastIndex = regex.lastIndex;
    }
    const after = text.substring(lastIndex);
    if (after) parts.push({ type: 'markdown', content: after });

    return parts.map((part, i) => {
      if (part.type === 'markdown') {
        return (
          <div key={i} className="prose prose-invert max-w-none leading-relaxed space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h3: ({ children }) => (
                <h3 className="text-base font-extrabold text-white pt-6 pb-2 border-b border-white/5 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full inline-block"></span>
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-sm font-bold text-accent pt-4 flex items-center gap-1.5">
                  ▸ {children}
                </h4>
              ),
              strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 my-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 my-3">{children}</ol>,
              li: ({ children }) => <li className="text-slate-300 text-sm">{children}</li>,
              p: ({ children }) => <p className="text-slate-300 text-sm leading-relaxed my-2">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent/50 pl-4 py-1 my-3 bg-accent/5 rounded-r-lg text-slate-400 italic text-sm">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {children}
                </a>
              ),
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                // Block code: has a language class
                if (match) {
                  const codeText = String(children).replace(/\n$/, '');
                  return (
                    <div className="my-5 rounded-xl overflow-hidden border border-white/8 shadow-xl">
                      <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center border-b border-white/8">
                        <div className="flex items-center gap-2.5">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500/70"></span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono font-bold tracking-widest">{match[1].toUpperCase()}</span>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeText)}
                          className="text-xs text-slate-500 hover:text-accent transition flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <pre className="p-5 bg-slate-950/80 overflow-x-auto text-slate-100 text-sm font-mono leading-relaxed">
                        <code>{codeText}</code>
                      </pre>
                    </div>
                  );
                }
                // Inline code
                return (
                  <code className="px-2 py-0.5 rounded-md bg-slate-800 text-accent font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {part.content}
          </ReactMarkdown>
          </div>
        );
      }
      return <div key={i}>{renderDiagram(part.name)}</div>;
    });
  };

  // ─── Navigation helpers ─────────────────────────────────────────────────────
  const allTopics = dayData.modules.flatMap((m, mi) =>
    m.topics.map((t, ti) => ({ moduleIndex: mi, topicIndex: ti, topic: t, module: m }))
  );
  const currentFlatIndex = allTopics.findIndex(
    t => t.moduleIndex === safeModIdx && t.topicIndex === safeTopIdx
  );
  const goPrev = () => {
    if (currentFlatIndex > 0) {
      const prev = allTopics[currentFlatIndex - 1];
      setActiveModuleIndex(prev.moduleIndex);
      setActiveTopicIndex(prev.topicIndex);
      setActiveTab('lesson');
    }
  };
  const goNext = () => {
    if (currentFlatIndex < allTopics.length - 1) {
      const next = allTopics[currentFlatIndex + 1];
      setActiveModuleIndex(next.moduleIndex);
      setActiveTopicIndex(next.topicIndex);
      setActiveTab('lesson');
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-dark text-slate-100 flex flex-col relative overflow-hidden">

      {/* ── TOP HEADER ── */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-3 px-4 md:px-6 flex justify-between items-center shrink-0 gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition group shrink-0"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition" /> Dashboard
        </button>

        {/* Centre: module title */}
        <div className="flex-1 min-w-0 text-center hidden md:block">
          <span className="text-[9px] text-accent tracking-widest uppercase font-semibold block">Current Lesson</span>
          <h2 className="text-sm font-bold text-white truncate">{activeTopic.title}</h2>
        </div>

        {/* Right: nav + bookmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={goPrev}
            disabled={currentFlatIndex <= 0}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] text-slate-500 font-mono">{currentFlatIndex + 1}/{allTopics.length}</span>
          <button
            onClick={goNext}
            disabled={currentFlatIndex >= allTopics.length - 1}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg border transition ${isBookmarked
              ? 'bg-accent/15 border-accent text-accent'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark size={14} />
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className={`${sidebarOpen ? 'w-full md:w-60' : 'w-0 overflow-hidden'} border-r border-white/5 bg-slate-950/30 overflow-y-auto shrink-0 md:h-[calc(100vh-56px)] transition-all duration-300`}>
          {/* Day tabs */}
          <div className="p-3 border-b border-white/5 flex gap-1.5 sticky top-0 bg-slate-950/80 backdrop-blur z-10">
            {['day1', 'day2', 'day3'].map(day => (
              <button
                key={day}
                onClick={() => {
                  setActiveDay(day);
                  setActiveModuleIndex(0);
                  setActiveTopicIndex(0);
                  setActiveTab('lesson');
                }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${activeDay === day
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                Day {day.slice(-1)}
              </button>
            ))}
          </div>

          {/* Day title */}
          <div className="px-3 py-2 border-b border-white/5">
            <p className="text-[9px] text-accent font-bold uppercase tracking-widest">{dayData.title}</p>
          </div>

          {/* Topic list */}
          <div className="p-2 space-y-3">
            {dayData.modules.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-0.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold pl-2 pt-2">
                  Module {mIdx + 1}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold pl-2 pr-2 pb-1 truncate">{mod.title}</p>

                {(mod.topics || []).map((top, tIdx) => {
                  const isActive = safeModIdx === mIdx && safeTopIdx === tIdx && activeTab === 'lesson';
                  const isDone = isTopicCompleted(mod.id, top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => {
                        setActiveModuleIndex(mIdx);
                        setActiveTopicIndex(tIdx);
                        setActiveTab('lesson');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center gap-2 transition ${isActive
                        ? 'bg-primary/20 text-white font-bold border-l-2 border-primary'
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate leading-snug">{top.title}</span>
                      {isDone && <Check size={11} className="text-success shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Assessments */}
            <div className="pt-3 border-t border-white/5 space-y-0.5">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold pl-2 pb-1">Assessments</p>

              {quizData && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center gap-2 transition ${activeTab === 'quiz'
                    ? 'bg-secondary/20 text-white font-bold border-l-2 border-secondary'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <span>📝 Day Quiz</span>
                  {isTopicCompleted(quizData.id, 'quiz') && <Check size={11} className="text-success shrink-0" />}
                </button>
              )}

              {projectData && (
                <button
                  onClick={() => setActiveTab('project')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center gap-2 transition ${activeTab === 'project'
                    ? 'bg-secondary/20 text-white font-bold border-l-2 border-secondary'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                  }`}
                >
                  <span>🛠️ Project</span>
                  {projectStatus === 'approved' && <Check size={11} className="text-success shrink-0" />}
                  {projectStatus === 'pending' && <span className="text-[9px] text-warning">⏳</span>}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ── MIDDLE CONTENT COLUMN ── */}
        <section className="flex-1 overflow-y-auto p-5 md:p-8 md:h-[calc(100vh-56px)] border-r border-white/5">

          {/* Lesson Tab */}
          {activeTab === 'lesson' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <span className="text-[10px] text-accent font-mono uppercase tracking-widest">{activeModule.title}</span>
                  <h1 className="text-2xl font-extrabold text-white mt-1">{activeTopic.title}</h1>
                </div>
                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${isTopicCompleted(activeModule.id, activeTopic.id)
                    ? 'bg-success/20 text-success border border-success/30'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                  }`}
                >
                  <Check size={13} />
                  {isTopicCompleted(activeModule.id, activeTopic.id) ? 'Completed ✓' : 'Mark Complete'}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-primary/30 via-accent/20 to-transparent"></div>

              {/* Lesson content */}
              <div className="prose-lg">
                {renderTopicContent(activeTopic.content)}
              </div>

              {/* Prev/Next nav */}
              <div className="flex justify-between pt-6 border-t border-white/5">
                <button
                  onClick={goPrev}
                  disabled={currentFlatIndex <= 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-white/5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={currentFlatIndex >= allTopics.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30 disabled:opacity-30 transition"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && quizData && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <span className="text-[10px] text-accent font-mono uppercase tracking-widest">Day Assessment</span>
                <h1 className="text-2xl font-extrabold text-white mt-1">{quizData.title}</h1>
                <p className="text-xs text-slate-400 mt-1">Score 60% or higher to unlock progress and earn your badge.</p>
              </div>

              <div className="h-px bg-gradient-to-r from-secondary/30 via-accent/20 to-transparent"></div>

              {/* Result banner */}
              {quizSubmitted && (
                <div className={`p-4 rounded-2xl border ${quizScore >= quizData.questions.length * 0.6
                  ? 'bg-success/10 border-success/30 text-success'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  <h3 className="font-extrabold text-base mb-1">
                    {quizScore >= quizData.questions.length * 0.6 ? '🎉 Excellent! You Passed!' : '😢 Not quite — Try Again'}
                  </h3>
                  <p className="text-xs">
                    Score: <strong>{quizScore}</strong> / <strong>{quizData.questions.length}</strong> ({Math.round((quizScore / quizData.questions.length) * 100)}%)
                  </p>
                </div>
              )}

              {/* Questions */}
              <div className="space-y-5">
                {quizData.questions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-card-dark/40 border border-white/5 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-100 leading-snug">{q.question}</p>
                    </div>
                    <div className="grid gap-2 pl-9">
                      {q.options.map(option => {
                        const selected = quizAnswers[q.id] === option;
                        const isCorrect = quizSubmitted && option === q.answer;
                        const isWrong = quizSubmitted && selected && option !== q.answer;
                        return (
                          <button
                            key={option}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: option })}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs border transition ${isCorrect
                              ? 'bg-success/15 border-success/40 text-success font-bold'
                              : isWrong
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : selected
                                  ? 'bg-primary/20 border-primary text-white font-bold'
                                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="ml-9 p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px]">
                        <span className="font-bold text-accent block mb-1">✓ Correct: {q.answer}</span>
                        <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < quizData.questions.length}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-slate-900 font-bold text-sm hover:shadow-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answers ({Object.keys(quizAnswers).length}/{quizData.questions.length} answered)
                </button>
              ) : (
                <button
                  onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(null); }}
                  className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:text-white transition cursor-pointer"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          )}

          {/* Project Tab */}
          {activeTab === 'project' && projectData && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                  <span className="text-[10px] text-accent font-mono uppercase tracking-widest">Hands-on Assignment</span>
                  <h1 className="text-2xl font-extrabold text-white mt-1">{projectData.title}</h1>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase self-start ${projectStatus === 'approved'
                  ? 'bg-success/15 border-success/30 text-success'
                  : projectStatus === 'pending'
                    ? 'bg-warning/15 border-warning/30 text-warning animate-pulse'
                    : projectStatus === 'rejected'
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {projectStatus === 'not_submitted' ? 'Not Submitted' : projectStatus}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-secondary/30 via-accent/20 to-transparent"></div>

              {projectFeedback && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                  <span className="font-bold text-primary block mb-1">💬 Instructor Feedback:</span>
                  <p className="text-slate-300 italic">"{projectFeedback}"</p>
                </div>
              )}

              {/* Problem details */}
              <div className="p-5 rounded-2xl bg-card-dark/30 border border-white/5 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Problem Statement</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{projectData.problem}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Architecture</h3>
                  <p className="text-sm text-accent font-mono leading-relaxed">{projectData.architecture}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Workflow Steps</h3>
                  <pre className="text-slate-400 font-sans text-xs leading-relaxed bg-slate-950/60 p-3 rounded-lg overflow-x-auto border border-white/5">
                    {projectData.workflow}
                  </pre>
                </div>
              </div>

              {/* Sample code block */}
              {projectData.code && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Starter Code</h3>
                  <div className="rounded-xl overflow-hidden border border-white/5">
                    <div className="bg-slate-900/80 px-4 py-2 flex justify-between items-center border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                          <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                          <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold">PYTHON</span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(projectData.code)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
                      >
                        <Copy size={10} /> Copy Code
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-950/70 overflow-x-auto text-slate-200 text-xs font-mono leading-relaxed">
                      {projectData.code}
                    </pre>
                  </div>
                </div>
              )}

              {/* Submission form */}
              <form onSubmit={handleProjectSubmit} className="glass-panel p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white">Submit Your Solution</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold mb-1 block">GitHub Repository URL *</label>
                    <input
                      type="url" required
                      placeholder="https://github.com/user/repo"
                      className="w-full px-3 py-2.5 glass-input text-xs"
                      value={projectForm.repoUrl}
                      onChange={e => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Live Demo URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://my-app.streamlit.app"
                      className="w-full px-3 py-2.5 glass-input text-xs"
                      value={projectForm.hostedUrl}
                      onChange={e => setProjectForm({ ...projectForm, hostedUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold mb-1 block">Submission Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Describe features, dependencies, or how to run your project..."
                    className="w-full px-3 py-2.5 glass-input text-xs resize-none"
                    value={projectForm.notes}
                    onChange={e => setProjectForm({ ...projectForm, notes: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={projectSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-slate-900 font-bold text-xs hover:shadow-lg transition cursor-pointer disabled:opacity-60"
                >
                  {projectSubmitting ? 'Submitting...' : projectStatus !== 'not_submitted' ? '🔄 Resubmit Project' : '🚀 Submit Project'}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* ── RIGHT PANEL: Code Playground + Notes ── */}
        <section className="w-full md:w-[380px] flex flex-col md:h-[calc(100vh-56px)] shrink-0 border-l border-white/5">

          {/* Monaco Editor */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-[280px] border-b border-white/5">
            <div className="bg-slate-950 px-4 py-2 flex justify-between items-center border-b border-white/5 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <Code2 size={12} className="text-primary" /> PYTHON PLAYGROUND
              </span>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3 py-1 bg-success hover:bg-success/90 text-slate-950 text-[10px] font-black rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-60"
              >
                <Play size={9} fill="black" /> {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>

            <div className="flex-grow min-h-[140px]">
              <Editor
                height="100%"
                language="python"
                theme="vs-dark"
                value={codeValue}
                onChange={v => setCodeValue(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono, monospace',
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* Terminal output */}
            <div className="bg-slate-950/90 border-t border-white/5 p-3 font-mono text-[10px] text-slate-400 h-32 overflow-y-auto shrink-0">
              <span className="text-[9px] text-slate-600 font-bold block mb-1 uppercase tracking-wider">▶ Console Output</span>
              <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">{terminalOutput}</pre>
            </div>
          </div>

          {/* Notes */}
          <div className="h-52 bg-slate-950/30 p-3 flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                <FileText size={11} className="text-accent" /> MY LESSON NOTES
              </span>
              <button
                onClick={handleSaveNote}
                disabled={noteSaving}
                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition font-semibold ${noteSaved
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                <Save size={10} /> {noteSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
            <textarea
              className="flex-grow w-full p-2 glass-input text-xs font-sans resize-none"
              placeholder="Jot down key concepts, code snippets, or questions for this topic..."
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
