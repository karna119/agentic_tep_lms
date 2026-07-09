// Static Workshop Curriculum Content (JS version for frontend simulation mode)
// This mirrors the backend workshop_content.py structure in JavaScript

export const STATIC_WORKSHOP_CONTENT = {
  day1: {
    title: "Build Your First AI Applications",
    modules: [
      {
        id: "day1_mod1",
        title: "Introduction to Generative AI",
        topics: [
          {
            id: "intro_genai",
            title: "What is GenAI, ML, DL, and LLMs?",
            content: `
### Overview
Welcome to Day 1 of **AGENTIC 003**. In this module, we lay down the conceptual foundations of Generative AI, tracing its roots from Artificial Intelligence (AI) down to Machine Learning (ML), Deep Learning (DL), and Large Language Models (LLMs).

### Objectives
- Define the relationship between AI, ML, DL, and Generative AI.
- Understand the core architecture of LLMs and how they predict the next token.
- Explain the role of the Gemini model family in the modern AI ecosystem.

### Real-world Analogy
Think of Artificial Intelligence as the entire field of **Transportation**. 
- **Machine Learning (ML)** is like **Automotive Engineering**: a subset that creates self-propelled vehicles using engines and rules.
- **Deep Learning (DL)** is like **Electric Vehicles (EVs)**: a specific, advanced subset that uses batteries and neural networks to power transport.
- **Generative AI & LLMs** are like **Self-Driving Autonomous EVs**: they don't just move; they generate completely new paths, make creative decisions, and talk to you like a co-pilot.

### Detailed Explanation
Generative AI refers to a subset of AI technologies that can generate new content — text, images, code, audio, and video.

- **AI**: The broad concept of machines executing tasks that mimic human intelligence.
- **ML**: Algorithmic approaches where systems learn patterns from data without being explicitly programmed.
- **Deep Learning**: ML algorithms based on multi-layered neural networks inspired by the human brain.
- **LLMs**: Deep learning models trained on vast text corpuses, capable of predicting the next word/token.

[DIAGRAM: PROMPT_FLOW]

### Gemini Architecture
Google's Gemini models are built to be **natively multimodal** — understanding text, images, audio, video, and code simultaneously. They use advanced transformer architectures with context windows up to 2 million tokens.

### Code Example
\`\`\`python
import numpy as np

# A simplified concept of predicting the next word based on probability
words = ["AI", "applications", "are", "intelligent", "agents"]
context = "AI applications are"

# Simple transition probability representation
probabilities = {
    "are": [0.02, 0.03, 0.05, 0.4, 0.5],  # 'intelligent' (40%) or 'agents' (50%)
}

next_word_probs = probabilities["are"]
predicted_index = np.argmax(next_word_probs)
next_word = words[predicted_index]

print(f"Context: {context}")
print(f"Predicted Next Word: {next_word}")
\`\`\`

**Output:**
\`\`\`text
Context: AI applications are
Predicted Next Word: agents
\`\`\`

### Summary
Generative AI represents a paradigm shift from analytical AI to creative AI. At the center is the Transformer architecture powering models like Google Gemini.
`
          },
          {
            id: "prompt_eng_basics",
            title: "Introduction to Prompt Engineering",
            content: `
### Overview
Prompt engineering is the art and science of formulating queries to guide LLMs to generate accurate, helpful, and structured outputs.

### Objectives
- Define what a prompt is and why it's the interface of the future.
- Explain the role of tokens and temperature settings.
- Write direct, clear instructions for deterministic outputs.

### Real-world Analogy
Imagine delegating a task to an extremely smart but context-blind intern. If you say *"Write a report on sales,"* they don't know the audience, format, or tone. If you say, *"Acting as our Senior Financial Analyst, write a 3-paragraph summary of Q2 sales growth formatted with bullet points for each region, in a professional tone,"* the intern will deliver exactly what you need.

[DIAGRAM: PROMPT_FLOW]

### Prompting Principles
1. **Be Specific**: Specify length, tone, format, and context.
2. **Use Delimiters**: Use triple backticks or XML tags to separate instructions from data.
3. **Specify the Output Format**: Ask for JSON, Markdown, or HTML explicitly.

### Code Example
\`\`\`python
# System prompt and User prompt structuring pattern
system_instruction = "You are a professional code reviewer. Provide feedback in a clean Markdown table."
user_prompt = "Review this Python function:\\n\\ndef add(a, b):\\n  return a+b"

full_prompt = f"<system>{system_instruction}</system>\\n<user>{user_prompt}</user>"
print(full_prompt)
\`\`\`

### Summary
By adjusting context, constraints, and instructions, prompt engineering acts as the programming language for LLMs.
`
          }
        ]
      },
      {
        id: "day1_mod2",
        title: "Gemini API Integration",
        topics: [
          {
            id: "gemini_api_setup",
            title: "Setting up the Google GenAI SDK",
            content: `
### Overview
To build software applications powered by Gemini, you must integrate Google's Developer APIs. We walk through authentication, installing the official SDK, and initializing your first connection.

### Step-by-Step API Key Setup
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click **"Get API key"** on the left sidebar.
4. Click **"Create API key"** and select a project.
5. Copy the key and save it securely. **Never commit this key to GitHub!**

### Code Example: Authentication & Text Generation
\`\`\`python
import os
from google import genai

# The client automatically picks up GEMINI_API_KEY environment variable
client = genai.Client()

response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Explain Quantum Computing in three sentences to a 10-year-old.',
)

print(response.text)
\`\`\`

### Output
\`\`\`text
Quantum computing is a new type of computer that uses quantum physics to solve
complex problems much faster than normal computers. Instead of bits that are
either 0 or 1, they use qubits which can be both at the same time. This lets
them think about millions of possibilities at once!
\`\`\`

### Practice
**Exercise**: Create a Python script that takes a user query from the terminal, sends it to \`gemini-1.5-flash\`, and prints the response.
`
          },
          {
            id: "gemini_multimodal",
            title: "Multimodal Applications (Chat, Vision, Streaming)",
            content: `
### Overview
Gemini is natively multimodal — it natively processes pixel coordinates, waveforms, and time series data alongside text.

### Code Example: Vision & Multi-turn Chat
\`\`\`python
from google import genai

client = genai.Client()

# Multi-turn Chat with Memory
chat = client.chats.create(model="gemini-1.5-flash")

response1 = chat.send_message("Hi, I want to learn LangGraph.")
print(f"Gemini: {response1.text}")

response2 = chat.send_message("What is its core concept?")
print(f"Gemini: {response2.text}")
\`\`\`

### Practice
**Practice Task**: Build a script that sends an image to Gemini and asks it to identify the objects visible in it.
`
          }
        ]
      },
      {
        id: "day1_mod3",
        title: "Advanced Prompt Engineering",
        topics: [
          {
            id: "advanced_techniques",
            title: "Few-Shot, CoT, and Structured JSON Outputs",
            content: `
### Overview
Standard prompting works for basic tasks. For complex reasoning and API integrations, we need Few-Shot, Chain of Thought (CoT), and schema-enforced structured JSON.

### Real-world Analogies
- **Few-Shot**: Showing a kid three examples of "good" and "bad" drawings before asking them to grade a new one.
- **Chain of Thought**: A math teacher writing intermediate steps on the board — teaching students to show their work.

### Code Example: Schema-Enforced JSON Output
\`\`\`python
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

class EntityExtractor(BaseModel):
    company_name: str = Field(description="Name of the company mentioned")
    products: List[str] = Field(description="List of products or services mentioned")
    sentiment: str = Field(description="Sentiment: POSITIVE, NEUTRAL, or NEGATIVE")
    confidence: float = Field(description="Confidence from 0.0 to 1.0")

client = genai.Client()

response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Google released Gemini 1.5 Flash, making their AI Studio suite highly competitive.',
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=EntityExtractor,
    ),
)

print(response.text)
\`\`\`

### Output
\`\`\`json
{
  "company_name": "Google",
  "products": ["Gemini 1.5 Flash", "AI Studio"],
  "sentiment": "POSITIVE",
  "confidence": 0.95
}
\`\`\`

### Summary
Enforcing Pydantic schemas eliminates parsing errors, making LLMs highly reliable for backend microservices.
`
          }
        ]
      },
      {
        id: "day1_mod4",
        title: "Building UIs with Streamlit",
        topics: [
          {
            id: "streamlit_intro",
            title: "Streamlit Basics and LLM Integrations",
            content: `
### Overview
**Streamlit** is an open-source Python library that lets you build interactive web apps for ML and AI in minutes — no JavaScript required!

### Code Example: Complete Chat Application
\`\`\`python
import streamlit as st
from google import genai

st.set_page_config(page_title="Gemini AI Companion", page_icon="🤖", layout="centered")
st.title("🤖 Gemini AI Companion")

@st.cache_resource
def get_client():
    return genai.Client()

if "chat" not in st.session_state:
    client = get_client()
    st.session_state.chat = client.chats.create(model="gemini-1.5-flash")
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if user_input := st.chat_input("Ask me anything..."):
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chat.send_message(user_input)
            st.markdown(response.text)
            st.session_state.messages.append({"role": "assistant", "content": response.text})
\`\`\`

### Deployment
1. Save to \`app.py\` and install: \`pip install streamlit google-genai\`
2. Run: \`streamlit run app.py\`
3. Open \`http://localhost:8501\`
`
          }
        ]
      },
      {
        id: "day1_mod5",
        title: "LangChain Foundations",
        topics: [
          {
            id: "langchain_basics",
            title: "Chains, Prompts, and Memory in LangChain",
            content: `
### Overview
**LangChain** is the industry-standard library simplifying LLM application construction with reusable abstractions for prompts, models, memory, chains, and agents.

### Core Concepts
- **PromptTemplates**: Reusable instructions with dynamic variable injection.
- **ChatModels**: Abstracted wrappers around LLM APIs.
- **OutputParsers**: Converters turning LLM text outputs into structured data.
- **LCEL (LangChain Expression Language)**: Declarative chaining using the pipe operator (\`|\`).

### Code Example: LCEL Chain
\`\`\`python
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Initialize the LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# 2. Design Prompt Template
prompt = ChatPromptTemplate.from_template(
    "You are a professional chef. Suggest a recipe using: {ingredients}."
)

# 3. Create Chain using LCEL pipe syntax
chain = prompt | llm | StrOutputParser()

# 4. Invoke the chain
recipe = chain.invoke({"ingredients": "eggs, tomatoes, and goat cheese"})
print(recipe)
\`\`\`

### Summary
LCEL's pipe operator creates declarative, composable pipelines — the foundation for building advanced agentic workflows.
`
          }
        ]
      }
    ],
    quiz: {
      id: "day1_quiz",
      title: "Day 1 Quiz: GenAI & Application Development",
      questions: [
        {
          id: 1,
          type: "mcq",
          question: "Which architecture forms the core foundation of modern Large Language Models (LLMs)?",
          options: ["Convolutional Neural Networks (CNN)", "Recurrent Neural Networks (RNN)", "Transformer Architecture", "Generative Adversarial Networks (GAN)"],
          answer: "Transformer Architecture",
          explanation: "The Transformer architecture ('Attention Is All You Need', 2017) is the foundation of all modern LLMs including GPT, Gemini, and Claude, due to its self-attention mechanism and parallel training capability."
        },
        {
          id: 2,
          type: "mcq",
          question: "What is the primary feature of Google's Gemini models compared to traditional language models?",
          options: ["They are faster but only process English text.", "They are built from the ground up to be natively multimodal.", "They only run on local microcontrollers.", "They do not require API keys."],
          answer: "They are built from the ground up to be natively multimodal.",
          explanation: "Gemini was designed to natively understand and combine text, images, video, audio, and code without separate pipelines for each format."
        },
        {
          id: 3,
          type: "mcq",
          question: "Which temperature value makes an LLM's outputs the most deterministic?",
          options: ["1.2", "0.8", "0.5", "0.0"],
          answer: "0.0",
          explanation: "Temperature 0.0 makes the model choose the most probable token at every step, creating consistent, deterministic outputs — ideal for math, code, and structured data."
        },
        {
          id: 4,
          type: "mcq",
          question: "What is Few-Shot Prompting?",
          options: ["Writing a prompt in less than 10 words.", "Providing input-output examples in the prompt to teach the model a task.", "Forcing the model to reply in a few sentences.", "Running a model on limited GPU memory."],
          answer: "Providing input-output examples in the prompt to teach the model a task.",
          explanation: "Few-Shot prompting includes input-output pairs in the prompt context, showing the model what constitutes a successful response before asking it to analyze new input."
        },
        {
          id: 5,
          type: "mcq",
          question: "In the Google GenAI SDK, which method sends a prompt to 'gemini-1.5-flash'?",
          options: ["client.send_prompt()", "client.models.generate_content()", "client.models.ask()", "client.chat.complete()"],
          answer: "client.models.generate_content()",
          explanation: "The official method in the Google GenAI Python SDK is client.models.generate_content(model=..., contents=...)."
        },
        {
          id: 6,
          type: "mcq",
          question: "What does specifying 'response_mime_type=\"application/json\"' do when calling Gemini?",
          options: ["Compresses the communication payload.", "Forces the model to respond in structured JSON format.", "Downloads the response as a file.", "Translates the prompt to Javascript."],
          answer: "Forces the model to respond in structured JSON format.",
          explanation: "Setting response MIME type to application/json instructs Gemini to format its output as valid JSON, making backend parsing reliable."
        },
        {
          id: 7,
          type: "mcq",
          question: "What mechanism does Streamlit use to keep track of user variables across page updates?",
          options: ["st.db_state", "st.local_storage", "st.session_state", "st.cache_data"],
          answer: "st.session_state",
          explanation: "Streamlit runs the entire script top-to-bottom on every interaction. st.session_state maintains state like chat history between reruns."
        },
        {
          id: 8,
          type: "mcq",
          question: "What does the pipe operator '|' represent in LangChain Expression Language (LCEL)?",
          options: ["Logical OR condition.", "Bitwise division.", "Chaining components — piping output of one as input to the next.", "Concatenating strings."],
          answer: "Chaining components — piping output of one as input to the next.",
          explanation: "In LCEL, | chains runnables. For example, prompt | llm | output_parser pipes prompt output into the LLM, then into the parser."
        },
        {
          id: 9,
          type: "mcq",
          question: "Which LangChain component formats raw user parameters into structured instructions for the LLM?",
          options: ["PromptTemplate", "SystemConnector", "DataFormatter", "MemoryBuffer"],
          answer: "PromptTemplate",
          explanation: "PromptTemplate defines a reusable template string (e.g. 'Summarize this {text}') and injects inputs dynamically to construct the final prompt."
        },
        {
          id: 10,
          type: "mcq",
          question: "How do you pass a system instruction in the Google GenAI SDK's generate_content call?",
          options: ["By prefixing the prompt with 'system:'", "Inside config=types.GenerateContentConfig(system_instruction=...)", "Inside client.models.system_instruction(Text)", "It is not supported by Gemini."],
          answer: "Inside config=types.GenerateContentConfig(system_instruction=...)",
          explanation: "System instructions are passed inside the config parameter using GenerateContentConfig."
        }
      ]
    },
    project: {
      id: "day1_project",
      title: "AI Resume Analyzer",
      problem: "HR recruiters spend hours manually screening resumes. Build a Streamlit dashboard that allows recruiters to upload a PDF resume, uses Gemini to parse details, extracts structured data (candidate name, email, skills, experience), matches them against a Job Description, and generates a rating (0-100) with a feedback report.",
      architecture: "Upload PDF → PyPDF2 Text Extraction → Gemini 1.5 Flash Analysis → Pydantic JSON Schema → Match Scoring → Streamlit Dashboard",
      workflow: "1. User uploads PDF resume.\n2. PDF is processed with pypdf.\n3. Visual layout analyzed by Gemini API.\n4. Extraction schema checks for structured keys.\n5. Match scoring calculates JD alignment.\n6. UI displays gauges, summaries, and downloadable PDF feedback.",
      folder_structure: "ai_resume_analyzer/\n├── app.py\n├── requirements.txt\n├── utils.py\n└── README.md",
      steps: "1. Set up virtualenv: pip install streamlit google-genai pypdf python-dotenv\n2. Create Pydantic model for CandidateInfo in utils.py.\n3. Implement PDF text parsing utility.\n4. Build UI components (file upload, text area for JD, action buttons).\n5. Integrate Gemini with structured response config.\n6. Display candidate profiles, match scores, recommendations.",
      code: `
# Core implementation sketch
import streamlit as st
from pydantic import BaseModel, Field
from typing import List
from google import genai
from google.genai import types
import pypdf

class ResumeAnalysis(BaseModel):
    candidate_name: str = Field(description="Full name of the candidate")
    email: str = Field(description="Email address")
    skills: List[str] = Field(description="Key technical skills")
    years_experience: float = Field(description="Total years of work experience")
    match_score: int = Field(description="Score 0-100 for JD alignment")
    strengths: List[str] = Field(description="Top 3 candidate strengths")
    gaps: List[str] = Field(description="Areas where candidate lacks required skills")
    recommendation: str = Field(description="Hire/no-hire decision justification")

st.title("📄 AI Resume Analyzer")

jd_input = st.text_area("Paste Job Description:", height=150)
uploaded_file = st.file_uploader("Upload Resume (PDF):", type="pdf")

if st.button("Analyze") and uploaded_file and jd_input:
    reader = pypdf.PdfReader(uploaded_file)
    resume_text = "".join([page.extract_text() for page in reader.pages])
    
    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=f"Resume: {resume_text}\\n\\nJD: {jd_input}",
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ResumeAnalysis
        )
    )
    import json
    data = json.loads(response.text)
    st.metric("Match Score", f"{data['match_score']}%")
    st.write(f"Name: {data['candidate_name']}")
`,
      explanation: "This app uses pypdf to extract resume text, combines it with the job description, and requests schema-enforced JSON from Gemini. Results display in premium Streamlit cards."
    }
  },
  day2: {
    title: "Knowledge Assistants",
    modules: [
      {
        id: "day2_mod1",
        title: "Retrieval-Augmented Generation (RAG)",
        topics: [
          {
            id: "rag_concepts",
            title: "The RAG Architecture: Embeddings & Retrievers",
            content: `
### Overview
LLMs are trained on public data up to a cutoff. They don't know about your private company reports or real-time documentation. **RAG** solves this by retrieving relevant text chunks from a private database and injecting them into the prompt.

### Real-world Analogy
Imagine a **closed-book exam** vs an **open-book exam** where a librarian finds the exact 3 pages containing the answers. You (the LLM) read those pages and write a perfect, fact-checked answer. That's RAG!

### RAG Pipeline
1. **Ingestion (Offline)**:
   - Parse documents (PDF, HTML, Markdown).
   - **Chunk**: Split into passages (e.g. 500 chars with 50-char overlap).
   - **Embed**: Convert each chunk into a high-dimensional vector using an embedding model.
   - **Index**: Store vectors in a Vector Database.

2. **Retrieval & Generation (Online)**:
   - **Query Embedding**: Convert user question to a vector.
   - **Similarity Search**: Find top-k closest vectors in the database.
   - **Augmentation**: Inject source text chunks into the prompt as "Context".
   - **Generation**: Send the augmented prompt to Gemini.

[DIAGRAM: RAG_FLOW]

### Code Example: Embeddings with Gemini
\`\`\`python
from google import genai

client = genai.Client()

response = client.models.embed_content(
    model="text-embedding-004",
    contents=[
        "LangGraph is a library for building stateful, multi-actor applications.",
        "ChromaDB is an open-source vector database for AI developers."
    ]
)

for i, embedding in enumerate(response.embeddings):
    print(f"Chunk {i+1} dimension: {len(embedding.values)}")
    print(f"First 5 values: {embedding.values[:5]}")
\`\`\`
`
          }
        ]
      },
      {
        id: "day2_mod2",
        title: "Vector Databases with ChromaDB",
        topics: [
          {
            id: "chromadb_basics",
            title: "Storing and Querying with ChromaDB",
            content: `
### Overview
**ChromaDB** is a lightweight, open-source vector database that can run locally inside your Python application — zero infrastructure required.

### Code Example: ChromaDB Operations
\`\`\`python
import chromadb

# Initialize local persistent client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Create a collection
collection = chroma_client.get_or_create_collection(name="workshop_guidelines")

# Add documents
collection.add(
    documents=[
        "Students need 80% attendance to qualify for the certificate.",
        "Day 1 project submission is due before Day 2 classes start.",
        "The Capstone project requires both code and a hosted demo."
    ],
    ids=["doc1", "doc2", "doc3"],
    metadatas=[{"type": "attendance"}, {"type": "deadline"}, {"type": "capstone"}]
)

# Semantic query
results = collection.query(
    query_texts=["Is there an attendance requirement?"],
    n_results=1
)

print(f"Found: {results['documents'][0][0]}")
print(f"Distance: {results['distances'][0][0]}")
\`\`\`
`
          }
        ]
      },
      {
        id: "day2_mod3",
        title: "Stateful Orchestration with LangGraph",
        topics: [
          {
            id: "langgraph_foundations",
            title: "Nodes, Edges, State, and Conditional Logic",
            content: `
### Overview
**LangGraph** allows you to build stateful, multi-actor applications by representing AI workflows as directed graphs with shared state.

### Core Components
- **State**: A shared memory structure (TypedDict or Pydantic model) passed between nodes.
- **Nodes**: Python functions that receive State, perform work, and return updated State values.
- **Edges**: Connect nodes. Conditional edges run router functions to decide next steps.

[DIAGRAM: LANGGRAPH_FLOW]

### Code Example: Router Graph
\`\`\`python
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END

class GraphState(TypedDict):
    question: str
    category: str
    answer: str

def classify_question(state: GraphState):
    q = state["question"].lower()
    category = "technical" if "code" in q or "error" in q else "general"
    return {"category": category}

def handle_technical(state: GraphState):
    return {"answer": "Let's review the stack trace."}

def handle_general(state: GraphState):
    return {"answer": "How can I help you learn today?"}

def route_decision(state: GraphState) -> Literal["technical", "general"]:
    return state["category"]

workflow = StateGraph(GraphState)
workflow.add_node("classify", classify_question)
workflow.add_node("technical", handle_technical)
workflow.add_node("general", handle_general)
workflow.add_edge(START, "classify")
workflow.add_conditional_edges("classify", route_decision,
    {"technical": "technical", "general": "general"})
workflow.add_edge("technical", END)
workflow.add_edge("general", END)

app = workflow.compile()
result = app.invoke({"question": "Help! My code has a SyntaxError!"})
print(result['answer'])
\`\`\`
`
          }
        ]
      },
      {
        id: "day2_mod4",
        title: "Multi-Agent Frameworks with CrewAI",
        topics: [
          {
            id: "crewai_basics",
            title: "Role-Playing Agents, Tasks, and Crews",
            content: `
### Overview
**CrewAI** orchestrates role-playing autonomous agents. By dividing tasks among multiple agents (each with a role, goal, backstory, and tools), you can run collaborative workflows.

### Real-world Analogy
Writing a research paper with a team:
- **Research Agent**: Searches and gathers raw sources.
- **Writer Agent**: Drafts a cohesive article.
- **Editor Agent**: Proofreads and formats references.

Each person does what they're best at, passing the document down the line.

[DIAGRAM: CREWAI_FLOW]

### Code Example: Writing Assistant Crew
\`\`\`python
from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="AI Trend Researcher",
    goal="Identify the top 3 rising trends in Agentic AI for 2026.",
    backstory="You're a technology analyst at a leading VC firm.",
    allow_delegation=False,
    verbose=True
)

writer = Agent(
    role="Tech Writer",
    goal="Draft an engaging blog post about the trends.",
    backstory="You're a veteran tech blogger who makes complex systems simple.",
    allow_delegation=False,
    verbose=True
)

task1 = Task(
    description="Research and output 3 bullet points on Agentic AI trends.",
    expected_output="A bulleted list with trend names and 2-sentence descriptions.",
    agent=researcher
)

task2 = Task(
    description="Write a 300-word newsletter based on the researcher's output.",
    expected_output="A newsletter article with a catchy headline.",
    agent=writer
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    process=Process.sequential,
    verbose=True
)

print("Crew compiled! Run crew.kickoff() to start execution.")
\`\`\`
`
          }
        ]
      }
    ],
    quiz: {
      id: "day2_quiz",
      title: "Day 2 Quiz: Knowledge Assistants & Agents",
      questions: [
        {
          id: 1,
          type: "mcq",
          question: "What does the 'R' in RAG stand for?",
          options: ["Reasoning", "Retrieval", "Recursive", "Random"],
          answer: "Retrieval",
          explanation: "RAG stands for Retrieval-Augmented Generation — we retrieve documents from external stores to augment the prompt before generating a response."
        },
        {
          id: 2,
          type: "mcq",
          question: "In the RAG process, what is the role of an embedding model?",
          options: ["To translate text into Spanish.", "To break documents into paragraphs.", "To convert text chunks into high-dimensional vectors representing semantic meaning.", "To store PDFs on the local drive."],
          answer: "To convert text chunks into high-dimensional vectors representing semantic meaning.",
          explanation: "Embedding models convert text strings into numerical vectors (lists of floats) that place words with similar meanings close together in vector space."
        },
        {
          id: 3,
          type: "mcq",
          question: "Which database is optimized to perform similarity searches on vectors?",
          options: ["PostgreSQL", "ChromaDB", "Redis", "SQLite"],
          answer: "ChromaDB",
          explanation: "ChromaDB is a specialized vector database designed to index and query vector embeddings efficiently, supporting cosine similarity searches."
        },
        {
          id: 4,
          type: "mcq",
          question: "What is 'chunking' in RAG ingestion?",
          options: ["Compressing a database into a zip file.", "Splitting large documents into smaller text segments to preserve relevance and fit the LLM context window.", "Encrypting user passwords.", "Running the LLM in parallel threads."],
          answer: "Splitting large documents into smaller text segments to preserve relevance and fit the LLM context window.",
          explanation: "Chunking splits documents into smaller, overlapping segments (e.g., 500 characters) to optimize retrieval relevance and avoid exceeding context limits."
        },
        {
          id: 5,
          type: "mcq",
          question: "How does LangGraph share data across different tasks in a workflow?",
          options: ["In a global MySQL database.", "Using environment variables.", "In a central 'State' structure passed from node to node.", "By writing temporary JSON files to disk."],
          answer: "In a central 'State' structure passed from node to node.",
          explanation: "LangGraph relies on a shared state (dict or Pydantic model) that accumulates keys and is passed through each executing node."
        },
        {
          id: 6,
          type: "mcq",
          question: "What type of edge in LangGraph runs a router function to decide which node to visit next?",
          options: ["Dynamic Edge", "Conditional Edge", "Switch Edge", "Route Edge"],
          answer: "Conditional Edge",
          explanation: "A conditional edge determines the execution path based on a router function's return value, routing to different destinations."
        },
        {
          id: 7,
          type: "mcq",
          question: "Which CrewAI concept defines an agent's personality, background, and expert context?",
          options: ["Goal", "Backstory", "Backbone", "SystemPrompt"],
          answer: "Backstory",
          explanation: "The 'backstory' parameter in CrewAI defines the persona, background, and expert context of the agent, guiding its reasoning."
        },
        {
          id: 8,
          type: "mcq",
          question: "In CrewAI, what is Process.sequential?",
          options: ["Parallel task execution", "Hierarchical delegation", "Tasks executed one after another in order", "Random task assignment"],
          answer: "Tasks executed one after another in order",
          explanation: "Process.sequential executes tasks in the exact order they are defined, feeding output from one as context to the next."
        },
        {
          id: 9,
          type: "mcq",
          question: "What metric is commonly used to query vector collections for similarity?",
          options: ["Euclidean distance or Cosine similarity", "Levenshtein edit distance", "MD5 Hash matching", "Binary lookup"],
          answer: "Euclidean distance or Cosine similarity",
          explanation: "Vector databases utilize Cosine similarity, Inner Product, or L2 (Euclidean) distance to evaluate closeness of text vectors."
        },
        {
          id: 10,
          type: "mcq",
          question: "What is a major cause of hallucination in a naive RAG pipeline?",
          options: ["Using a database that is too fast.", "Retrieving irrelevant context chunks that confuse the LLM.", "High temperature settings.", "Using the Gemini API instead of open source models."],
          answer: "Retrieving irrelevant context chunks that confuse the LLM.",
          explanation: "If similarity search fetches noisy, irrelevant chunks, the LLM incorporates that noise and generates incorrect factual claims."
        }
      ]
    },
    project: {
      id: "day2_project",
      title: "University Regulation Assistant",
      problem: "University students struggle to find registration deadlines, exam criteria, and course requirements in complex 200-page academic PDF handbooks. Build a RAG knowledge assistant that parses a sample university handbook, splits it into chunks, indexes in ChromaDB, and runs a QA interface answering student queries with exact document citations.",
      architecture: "Parse Academic PDF → LangChain Text Splitter → ChromaDB Storage → Similarity Search → Prompt Injection → Gemini 1.5 Flash Answer",
      workflow: "1. Student asks a question (e.g. 'Can I drop a class after week 3?').\n2. Query is embedded to a vector.\n3. ChromaDB extracts the top 3 relevant paragraphs.\n4. Context and question are merged in a prompt template.\n5. Gemini generates a structured response with citations.",
      folder_structure: "academic_rag/\n├── ingest.py\n├── app.py\n├── handbook.pdf\n└── requirements.txt",
      steps: "1. Install: chromadb, langchain-community, langchain-google-genai, pypdf.\n2. Write ingest.py to load and chunk the PDF.\n3. Save chunks to local ChromaDB.\n4. Write app.py Streamlit interface.\n5. Implement citation UI displaying source page extracts.",
      code: `
import chromadb
from google import genai
import pypdf

def ask_assistant(question):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_collection("university_regs")
    client = genai.Client()
    
    # Embed the query
    q_response = client.models.embed_content(
        model="text-embedding-004",
        contents=question
    )
    query_vector = q_response.embeddings[0].values
    
    # Search Chroma
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=2
    )
    
    context = "\\n\\n".join(results["documents"][0])
    
    # Generate Answer with context
    prompt = f"""You are an official University Academic Advisor.
    Answer using ONLY this context:
    {context}
    
    Question: {question}"""
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt
    )
    return response.text, results["metadatas"][0]
`,
      explanation: "The ingest phase chunks the PDF and generates vector representations using text-embedding-004, storing in ChromaDB. Queries embed the question, compute similarity to fetch relevant chunks, and wrap in an academic adviser template for Gemini to answer with source citations."
    }
  },
  day3: {
    title: "Build Intelligent Agents",
    modules: [
      {
        id: "day3_mod1",
        title: "Model Context Protocol (MCP)",
        topics: [
          {
            id: "mcp_architecture",
            title: "Understanding the Model Context Protocol",
            content: `
### Overview
The **Model Context Protocol (MCP)** is an open protocol (open-sourced by Anthropic in 2024, industry-adopted in 2025) that defines a standard interface for LLMs to securely interact with local systems, file directories, tools, databases, and APIs.

### Real-world Analogy
Imagine you are a foreign tourist (the LLM) visiting a new country. You want to buy food, book a taxi, and check into a hotel. Instead of learning 15 different local languages and visiting 15 different offices, you use a universal translator app (MCP Client) that connects you to standard local services (MCP Servers). Each service speaks the exact same protocol, letting you securely access tools (ordering food, booking taxi) and resources (viewing maps, checking hotel availability) with zero friction. MCP is the universal translator/adapter for AI models!

### The MCP Architecture
- **Host**: The orchestrator application (IDE, terminal, Slack bot) that routes LLM queries.
- **Client**: Connects to MCP servers, handles authentication and protocols.
- **Server**: Lightweight programs exposing:
  - **Resources**: Read-only files, database schemas, or logs.
  - **Tools**: Executable functions (read_file, run_command, calculate).
  - **Prompts**: Reusable prompt templates.

[DIAGRAM: MCP_FLOW]

### Code Example: Building an MCP Server
\`\`\`python
from mcp.server.fastmcp import FastMCP

# Create a FastMCP Server
mcp = FastMCP("Math Server")

@mcp.tool()
def add_numbers(x: float, y: float) -> float:
    """Add two numbers together."""
    return x + y

@mcp.tool()
def get_system_load() -> str:
    """Retrieve server CPU load."""
    import psutil
    return f"CPU: {psutil.cpu_percent()}%"

if __name__ == "__main__":
    mcp.run()
\`\`\`
`
          }
        ]
      },
      {
        id: "day3_mod2",
        title: "Agentic AI & Autonomy",
        topics: [
          {
            id: "agentic_principles",
            title: "Planning, Reflection, Memory, and Tool Calling",
            content: `
### Overview
What makes an LLM an **Agent**? The capacity for **autonomous loops**. An agent plans its steps, invokes tools, analyzes errors, reflects on results, and loops until the goal is achieved.

### Real-world Analogy
Imagine you are driving a car to a new restaurant:
- **Non-Agentic AI (Single LLM)**: You ask a passenger for directions, they give you a single route, and you blindly follow it. If there is a road closure, you get stuck and fail.
- **Agentic AI (Autonomous Agent)**: You use Google Maps. It plans a route (Planning). As you drive, it detects traffic (Observation). If a road is blocked, it self-corrects and calculates a new path (Reflection/Re-planning). It executes turns using the steering wheel (Tool calling) and remembers where you've been (Memory) until you arrive at the restaurant. That is the power of an Agentic Loop!

### The Agentic Loop
1. **Planning**: Break a big task into sub-tasks.
2. **Tool Calling**: Invoke external APIs to fetch raw data.
3. **Observation**: Review tool output.
4. **Reflection**: Figure out what went wrong and adapt.
5. **Execution**: Complete the task once criteria is met.

[DIAGRAM: AGENTIC_RAG]

### Code Example: Gemini Manual Tool Loop
\`\`\`python
from google import genai
from google.genai import types

client = genai.Client()

def get_weather(location: str) -> str:
    if "san francisco" in location.lower():
        return "Sunny, 68°F."
    return "Cloudy, 50°F."

# Register function as tool
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='What is the weather in San Francisco?',
    config=types.GenerateContentConfig(tools=[get_weather])
)

# Handle function call request
if response.function_calls:
    for call in response.function_calls:
        print(f"Gemini requested tool: {call.name}")
        result = get_weather(**call.args)
        
        # Send result back
        final = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=[
                'What is the weather in San Francisco?',
                response.candidates[0].content,
                types.Part.from_function_response(
                    name="get_weather",
                    response={"result": result}
                )
            ]
        )
        print(f"Final Answer: {final.text}")
\`\`\`
`
          }
        ]
      },
      {
        id: "day3_mod3",
        title: "Agentic RAG",
        topics: [
          {
            id: "agentic_rag_concepts",
            title: "Planner, Retriever, Reasoner, and Executor Loops",
            content: `
### Overview
Traditional RAG is passive — it retrieves once and answers once. **Agentic RAG** turns retrieval into an active loop: the agent searches multiple times, evaluates relevance, and rewrites queries if search results are poor.

[DIAGRAM: AGENTIC_RAG]

### Self-Correction Loop
\`\`\`python
def grade_documents(state):
    documents = state["documents"]
    question = state["question"]
    
    relevant_docs = []
    for doc in documents:
        # Call LLM to evaluate relevance (Binary score: YES/NO)
        is_relevant = evaluate_relevance(doc, question)
        if is_relevant:
            relevant_docs.append(doc)
    
    if len(relevant_docs) == 0:
        # Route back to rewrite the query
        return {"documents": relevant_docs, "action": "rewrite_query"}
    
    return {"documents": relevant_docs, "action": "generate_answer"}
\`\`\`

### Benefits over Naive RAG
- **Self-correction**: Detects irrelevant retrieval and re-searches.
- **Query rewriting**: Reformulates ambiguous queries for better results.
- **Web fallback**: Falls back to web search if the local index lacks information.
`
          }
        ]
      }
    ],
    quiz: {
      id: "day3_quiz",
      title: "Day 3 Quiz: Intelligent Agents & Capstone",
      questions: [
        {
          id: 1,
          type: "mcq",
          question: "What does MCP stand for in modern AI engineering?",
          options: ["Model Context Protocol", "Multi-agent Control Portal", "Maximum Context Processing", "Machine Collaboration Program"],
          answer: "Model Context Protocol",
          explanation: "MCP stands for Model Context Protocol — an open standard designed to connect AI models safely to data sources, tools, and environments."
        },
        {
          id: 2,
          type: "mcq",
          question: "Which MCP component exposes local databases, file tools, or APIs?",
          options: ["The Client", "The Host", "The Server", "The Orchestrator"],
          answer: "The Server",
          explanation: "MCP Servers are lightweight services that expose tools, resources, and prompt templates to client applications."
        },
        {
          id: 3,
          type: "mcq",
          question: "What is the primary difference between a traditional LLM script and an Agent?",
          options: ["Agents are written in Javascript.", "Agents execute in autonomous loops (Planning, Tool execution, Reflection) to achieve goals.", "Agents do not require API keys.", "Agents are faster but less accurate."],
          answer: "Agents execute in autonomous loops (Planning, Tool execution, Reflection) to achieve goals.",
          explanation: "Agents decide which actions (tools) to call, examine outputs, adjust plans dynamically, and loop until a desired condition is satisfied."
        },
        {
          id: 4,
          type: "mcq",
          question: "How does Gemini indicate it needs to call an external function?",
          options: ["By throwing an API Error.", "By returning a 'function_calls' metadata block in its response.", "By printing a system log.", "By calling the Python function directly in the background."],
          answer: "By returning a 'function_calls' metadata block in its response.",
          explanation: "When tool-calling is configured, the model returns a response requesting a function call with the name and parameters, leaving execution to the client program."
        },
        {
          id: 5,
          type: "mcq",
          question: "What is the primary benefit of Agentic RAG compared to Naive RAG?",
          options: ["It uses fewer tokens.", "It retrieves everything in a single lookup.", "It evaluates and self-corrects retrieval relevance, rewriting queries or using web fallbacks if needed.", "It does not require text embeddings."],
          answer: "It evaluates and self-corrects retrieval relevance, rewriting queries or using web fallbacks if needed.",
          explanation: "Agentic RAG integrates validation steps: evaluating retrieved results, regenerating queries, or executing web searches if local indices are insufficient."
        }
      ]
    },
    project: {
      id: "day3_project",
      title: "Student Academic Advisor Agent",
      problem: `Students need tailored suggestions on course pathways, credit transfers, and workload management. Build a 'Student Academic Advisor Agent' using LangGraph with ChromaDB RAG for academic handbook retrieval and a Gemini Planner that creates personalized study plans.

### Alternate Capstone Project Options
Click on the **💡 More Project Ideas** tab in the left sidebar to view the 15 industry-specific project problem statements.`,
      architecture: "User Question → Router Node → Query ChromaDB → LLM Planner → Workload Validation → Corrected Schedule → Student Report",
      workflow: "1. Student enters current credits and career interest.\n2. LangGraph state initializes.\n3. Retriever checks handbook policies.\n4. Planner schedules recommended courses.\n5. Validator checks workload balance.\n6. UI displays the semester timeline.",
      folder_structure: "student_advisor/\n├── graph.py\n├── db.py\n├── app.py\n├── data/\n│   └── courses.json\n└── requirements.txt",
      steps: "1. Create graph.py with state schema and nodes (Classify, QueryDB, Schedule, WorkloadCheck).\n2. Setup ChromaDB helper connecting to syllabus data.\n3. Implement workload threshold calculation in WorkloadCheck node.\n4. Build Streamlit app displaying advising logs and semester plans.",
      code: `
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END

class AdvisorState(TypedDict):
    student_profile: dict
    career_goal: str
    credits_completed: int
    recommended_courses: List[str]
    workload_score: float
    advising_log: str
    replan_count: int

def planner_node(state: AdvisorState):
    suggested = ["CS-401 (AI Systems)", "CS-402 (NLP)", "CS-405 (Agentic Workflows)"]
    return {
        "recommended_courses": suggested,
        "advising_log": "Generated initial academic roadmap."
    }

def workload_check_node(state: AdvisorState):
    # Calculate difficulty score (simplified)
    score = len(state["recommended_courses"]) * 3.3
    return {"workload_score": score}

def route_workload(state: AdvisorState):
    if state["workload_score"] > 8.0 and state["replan_count"] < 2:
        return "replan"
    return "approve"

workflow = StateGraph(AdvisorState)
workflow.add_node("plan", planner_node)
workflow.add_node("check", workload_check_node)
workflow.add_edge(START, "plan")
workflow.add_edge("plan", "check")
workflow.add_conditional_edges(
    "check", route_workload,
    {"replan": "plan", "approve": END}
)
app = workflow.compile()
print("Academic Advisor Agent compiled!")
`,
      explanation: "This LangGraph setup creates a feedback loop: a planner suggests course schedules, a validator scores difficulty, and a conditional edge routes back to the planner if workload is too high — ensuring balanced recommendations."
    }
  }
};
