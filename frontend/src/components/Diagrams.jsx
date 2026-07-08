import React from 'react';

// 1. Prompt Engineering Flow Diagram
export const PromptFlowDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider">Prompt Engineering Loop</h4>
    
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-lg gap-4 md:gap-2">
      {/* Human Node */}
      <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700 w-32 text-center shadow-lg relative group transition-all duration-300 hover:border-primary">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg mb-2">👤</div>
        <span className="text-xs font-semibold text-slate-200">Human Developer</span>
        <span className="text-[10px] text-slate-400 mt-1">Formulates Goal</span>
      </div>

      <div className="text-2xl text-primary animate-pulse rotate-90 md:rotate-0">➡️</div>

      {/* Prompt Node */}
      <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700 w-32 text-center shadow-lg relative group transition-all duration-300 hover:border-accent">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg mb-2">✍️</div>
        <span className="text-xs font-semibold text-slate-200">Prompt / Input</span>
        <span className="text-[10px] text-slate-400 mt-1">Context + Persona</span>
      </div>

      <div className="text-2xl text-accent animate-pulse rotate-90 md:rotate-0">➡️</div>

      {/* LLM Node */}
      <div className="flex flex-col items-center p-4 rounded-xl bg-primary/20 border border-primary/50 w-32 text-center shadow-lg relative group transition-all duration-300 hover:scale-105">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-accent opacity-20 blur-sm group-hover:opacity-40 transition duration-500"></div>
        <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-cyan-300 font-bold text-lg mb-2 relative">♊</div>
        <span className="text-xs font-bold text-slate-100 relative">Gemini API</span>
        <span className="text-[10px] text-accent mt-1 relative font-mono">1.5 Flash</span>
      </div>

      <div className="text-2xl text-success animate-pulse rotate-90 md:rotate-0">➡️</div>

      {/* Response Node */}
      <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/80 border border-slate-700 w-32 text-center shadow-lg relative group transition-all duration-300 hover:border-success">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success font-bold text-lg mb-2">📄</div>
        <span className="text-xs font-semibold text-slate-200">Structured Out</span>
        <span className="text-[10px] text-slate-400 mt-1">JSON / Text</span>
      </div>
    </div>
  </div>
);

// 2. RAG Architecture Diagram
export const RagFlowDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl relative overflow-hidden">
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider text-center">Retrieval-Augmented Generation (RAG) pipeline</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-7 items-center justify-center gap-4 text-center">
      {/* 1. PDF */}
      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center hover:border-primary transition duration-300">
        <span className="text-2xl mb-1">📄</span>
        <span className="text-[11px] font-bold text-slate-200">Academic PDF</span>
      </div>
      
      <div className="text-slate-500 font-bold text-lg rotate-90 md:rotate-0">➡️</div>
      
      {/* 2. Chunking */}
      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center hover:border-accent transition duration-300">
        <span className="text-2xl mb-1">✂️</span>
        <span className="text-[11px] font-bold text-slate-200">Text Chunking</span>
        <span className="text-[9px] text-slate-400">500 chars window</span>
      </div>
      
      <div className="text-slate-500 font-bold text-lg rotate-90 md:rotate-0">➡️</div>
      
      {/* 3. Embeddings */}
      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center hover:border-secondary transition duration-300">
        <span className="text-2xl mb-1">🧬</span>
        <span className="text-[11px] font-bold text-slate-200">Embeddings</span>
        <span className="text-[9px] text-slate-400">text-embedding-004</span>
      </div>
      
      <div className="text-slate-500 font-bold text-lg rotate-90 md:rotate-0">➡️</div>
      
      {/* 4. Vector Database */}
      <div className="p-3 rounded-xl bg-primary/20 border border-primary/40 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition duration-300 col-span-1">
        <span className="text-2xl mb-1">🗄️</span>
        <span className="text-[11px] font-bold text-slate-100">ChromaDB</span>
        <span className="text-[9px] text-accent font-mono">Vector Storage</span>
      </div>
    </div>

    {/* Query and generation flow */}
    <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-around">
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs w-44">
          <span className="text-accent font-bold">Query:</span> "Attendance rules?"
        </div>
        <div className="text-2xl text-accent rotate-90 md:rotate-0">➡️</div>
        <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs w-48 text-left">
          <span className="text-primary font-bold">Retriever:</span> Cosine search gets closest text chunks.
        </div>
        <div className="text-2xl text-primary rotate-90 md:rotate-0">➡️</div>
        <div className="p-3 rounded-xl bg-secondary/20 border border-secondary/50 text-xs w-48 font-bold">
          Gemini synthesizes answer using document facts.
        </div>
      </div>
    </div>
  </div>
);

// 3. LangGraph Workflow Diagram
export const LangGraphDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl relative overflow-hidden">
    <div className="absolute -top-10 -left-10 w-36 h-36 bg-secondary/15 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider text-center">LangGraph Stateful Loop</h4>
    
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      {/* START */}
      <div className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
        START
      </div>
      
      <div className="w-0.5 h-6 bg-slate-600"></div>

      {/* Classify Node */}
      <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-full text-center relative group">
        <div className="text-xs font-bold text-slate-100">Node: Classify Question</div>
        <div className="text-[10px] text-slate-400 mt-1">Updates state: {'{ question, category }'}</div>
      </div>
      
      <div className="w-0.5 h-6 bg-slate-600"></div>

      {/* Router Condition */}
      <div className="w-32 h-32 rotate-45 border border-accent bg-accent/5 flex items-center justify-center relative shadow-inner">
        <div className="-rotate-45 text-center p-2">
          <span className="text-[10px] font-bold text-accent uppercase tracking-wide block">Router</span>
          <span className="text-[10px] text-slate-300 font-semibold mt-1 block">Workload &gt; 8?</span>
        </div>
      </div>

      {/* Branching Edges */}
      <div className="w-full flex justify-between px-10 -mt-6">
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-warning font-bold">Yes (Replan)</div>
          <div className="w-0.5 h-10 bg-warning"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-success font-bold">No (Approve)</div>
          <div className="w-0.5 h-10 bg-success"></div>
        </div>
      </div>

      <div className="w-full flex justify-between">
        {/* Replan Link back */}
        <div className="p-3 rounded-lg bg-warning/15 border border-warning/40 text-center w-5/12 text-xs">
          <span className="font-semibold text-warning">Node: Substitute Course</span>
          <span className="block text-[9px] text-slate-400 mt-1">Increment Replan Count</span>
        </div>

        {/* End Node */}
        <div className="p-3 rounded-lg bg-success/20 border border-success/50 text-center w-5/12 text-xs flex items-center justify-center">
          <span className="font-bold text-success">END / Save Plan</span>
        </div>
      </div>
    </div>
  </div>
);

// 4. CrewAI Workflow Diagram
export const CrewAiDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-primary/10 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider text-center">CrewAI Multi-Agent Collaboration</h4>
    
    <div className="flex flex-col md:flex-row items-stretch justify-around gap-6">
      {/* Agent 1 */}
      <div className="flex-1 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col justify-between hover:border-primary transition duration-300">
        <div>
          <span className="text-2xl block mb-2">🔍</span>
          <h5 className="text-xs font-bold text-slate-100">AI Researcher</h5>
          <p className="text-[10px] text-slate-400 mt-1 italic">"Spot patterns in GenAI tech trends"</p>
        </div>
        <div className="mt-4 p-2 bg-slate-900 rounded text-[9px] text-left text-slate-300 font-mono">
          <span className="text-primary">Output:</span> Raw trend document list.
        </div>
      </div>

      <div className="flex items-center justify-center text-slate-500 font-bold text-xl rotate-90 md:rotate-0">➡️</div>

      {/* Agent 2 */}
      <div className="flex-1 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col justify-between hover:border-accent transition duration-300">
        <div>
          <span className="text-2xl block mb-2">✍️</span>
          <h5 className="text-xs font-bold text-slate-100">Tech Writer</h5>
          <p className="text-[10px] text-slate-400 mt-1 italic">"Make complex tech simple for audience"</p>
        </div>
        <div className="mt-4 p-2 bg-slate-900 rounded text-[9px] text-left text-slate-300 font-mono">
          <span className="text-accent">Output:</span> A 300-word drafted newsletter.
        </div>
      </div>

      <div className="flex items-center justify-center text-slate-500 font-bold text-xl rotate-90 md:rotate-0">➡️</div>

      {/* Agent 3 */}
      <div className="flex-1 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center flex flex-col justify-between hover:border-success transition duration-300">
        <div>
          <span className="text-2xl block mb-2">✂️</span>
          <h5 className="text-xs font-bold text-slate-100">Editor Agent</h5>
          <p className="text-[10px] text-slate-400 mt-1 italic">"Check facts and refine grammar"</p>
        </div>
        <div className="mt-4 p-2 bg-slate-900 rounded text-[9px] text-left text-slate-300 font-mono">
          <span className="text-success">Output:</span> Finalized publishing-ready copy.
        </div>
      </div>
    </div>
  </div>
);

// 5. Model Context Protocol (MCP) Diagram
export const McpDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider text-center">Model Context Protocol (MCP) Structure</h4>
    
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
      {/* Host */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 w-40 text-center shadow-lg">
        <div className="text-xs font-bold text-slate-200">Host (Client App)</div>
        <div className="text-[9px] text-slate-400 mt-1">Cursor IDE / Terminal</div>
        <div className="mt-2 w-full h-8 bg-slate-900 rounded flex items-center justify-center text-xs font-semibold text-primary">♊ Gemini Client</div>
      </div>

      {/* Bridge Protocol */}
      <div className="flex flex-col items-center">
        <div className="h-0.5 w-16 bg-gradient-to-r from-primary to-accent relative hidden md:block">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full animate-ping"></div>
        </div>
        <span className="text-[9px] text-accent font-mono mt-1 uppercase tracking-widest">MCP protocol</span>
      </div>

      {/* MCP Server */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/40 w-44 text-center shadow-lg relative">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-accent opacity-10 blur-sm"></div>
        <div className="text-xs font-bold text-slate-100 relative">MCP Server (Python/TS)</div>
        <div className="text-[9px] text-accent font-mono mt-1 relative">Exposes schemas & capabilities</div>
        
        {/* Exposed resources/tools */}
        <div className="mt-3 space-y-1 relative text-left">
          <div className="px-2 py-1 bg-slate-900 rounded text-[9px] text-slate-300 font-mono">🛠️ tool: read_file()</div>
          <div className="px-2 py-1 bg-slate-900 rounded text-[9px] text-slate-300 font-mono">🛠️ tool: query_postgres()</div>
          <div className="px-2 py-1 bg-slate-900 rounded text-[9px] text-slate-300 font-mono">📂 resource: db_schema</div>
        </div>
      </div>

      <div className="flex items-center justify-center text-slate-500 font-bold text-xl rotate-90 md:rotate-0">➡️</div>

      {/* System Resources */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 w-40 text-center shadow-lg">
        <div className="text-xs font-bold text-slate-200">Target System</div>
        <div className="text-[9px] text-slate-400 mt-1">Local OS / Private Cloud</div>
        <div className="mt-3 grid grid-cols-2 gap-1">
          <span className="p-1 bg-slate-900 rounded text-[9px] text-slate-400 font-mono">Filesystem</span>
          <span className="p-1 bg-slate-900 rounded text-[9px] text-slate-400 font-mono">Postgres</span>
        </div>
      </div>
    </div>
  </div>
);

// 6. Agentic RAG Diagram
export const AgenticRagDiagram = () => (
  <div className="my-8 p-6 glass-panel rounded-2xl relative overflow-hidden">
    <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-primary/15 blur-3xl animate-glow"></div>
    <h4 className="text-sm font-semibold text-accent mb-6 uppercase tracking-wider text-center">Agentic RAG Self-Correction Loop</h4>
    
    <div className="flex flex-col items-center max-w-lg mx-auto">
      {/* 1. User query */}
      <div className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs w-48 text-center shadow-md">
        <span className="text-[10px] text-accent block uppercase font-mono">Input Query</span>
        <span className="font-semibold text-slate-200">"Explain drop regulations"</span>
      </div>

      <div className="text-2xl text-slate-600 my-2">⬇️</div>

      {/* 2. Planner */}
      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center w-64 shadow-md hover:border-primary transition duration-300">
        <span className="text-xs font-bold text-slate-100 block">1. Planner & Router Node</span>
        <span className="text-[9px] text-slate-400">Decides if handbook lookup or web search is needed.</span>
      </div>

      <div className="text-2xl text-slate-600 my-2">⬇️</div>

      {/* 3. Retriever */}
      <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center w-64 shadow-md hover:border-accent transition duration-300">
        <span className="text-xs font-bold text-slate-100 block">2. Retriever (ChromaDB)</span>
        <span className="text-[9px] text-slate-400">Pulls top semantic text segments.</span>
      </div>

      <div className="text-2xl text-slate-600 my-2">⬇️</div>

      {/* 4. Grader / Reasoner */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/40 text-center w-72 shadow-lg relative">
        <span className="text-xs font-bold text-slate-100 block">3. Reasoner & Grader Loop</span>
        <span className="text-[9px] text-accent font-mono block mt-1">Evaluates: Are documents relevant to query?</span>
        
        {/* Options */}
        <div className="mt-3 flex gap-2 justify-center">
          <div className="flex-1 p-1 bg-success/20 border border-success/40 rounded text-[9px] text-slate-200">
            <span className="font-bold text-success block">YES</span>
            Generate answer
          </div>
          <div className="flex-1 p-1 bg-warning/20 border border-warning/40 rounded text-[9px] text-slate-200">
            <span className="font-bold text-warning block">NO (Re-write)</span>
            Refine query & retrieve again
          </div>
        </div>
      </div>

      <div className="text-2xl text-success my-2">⬇️</div>

      {/* 5. Generator */}
      <div className="p-3 rounded-xl bg-success/20 border border-success/40 text-center w-64 shadow-md">
        <span className="text-xs font-bold text-slate-100 block">4. Answer Generator</span>
        <span className="text-[9px] text-success font-mono">Output perfect, fact-checked report.</span>
      </div>
    </div>
  </div>
);

// Map diagrams to names for dynamic rendering
export const renderDiagram = (name) => {
  switch (name) {
    case 'PROMPT_FLOW': return <PromptFlowDiagram />;
    case 'RAG_FLOW': return <RagFlowDiagram />;
    case 'LANGGRAPH_FLOW': return <LangGraphDiagram />;
    case 'CREWAI_FLOW': return <CrewAiDiagram />;
    case 'MCP_FLOW': return <McpDiagram />;
    case 'AGENTIC_RAG': return <AgenticRagDiagram />;
    default: return <div className="text-xs text-slate-500 my-2 italic">Diagram template: {name} not found.</div>;
  }
};
