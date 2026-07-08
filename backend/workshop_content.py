# -*- coding: utf-8 -*-

WORKSHOP_CONTENT = {
    "day1": {
        "title": "Build Your First AI Applications",
        "modules": [
            {
                "id": "day1_mod1",
                "title": "Introduction to Generative AI",
                "topics": [
                    {
                        "id": "intro_genai",
                        "title": "What is GenAI, ML, DL, and LLMs?",
                        "content": """
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
- **Generative AI & LLMs** are like **Self-Driving Autonomous EVs**: they don't just move; they generate completely new paths, make creative decisions on the road, and talk to you like a co-pilot.

Another way to think about LLMs specifically: Imagine a **Master Chef** who has read every cookbook in the world. When you ask them to bake a cake, they don't just copy a single recipe; they predict the most logical next ingredient to add based on the vast culinary knowledge they've consumed, effectively generating a completely original, yet structurally sound, recipe on the fly.

### Detailed Explanation
Generative AI refers to a subset of artificial intelligence technologies that can generate new content, including text, images, code, audio, and video. 
- **Artificial Intelligence (AI)**: The broad concept of machines executing tasks that mimic human intelligence.
- **Machine Learning (ML)**: Algorithmic approaches where systems learn patterns from data without being explicitly programmed.
- **Deep Learning (DL)**: ML algorithms based on multi-layered neural networks (deep neural networks) inspired by the human brain.
- **Large Language Models (LLMs)**: Deep learning models trained on vast corpuses of text, capable of understanding and generating human language by predicting the probability distribution of the next word/token.

[DIAGRAM: PROMPT_FLOW]

### Gemini Architecture
Google's Gemini models are built from the ground up to be **multimodal** (natively understanding text, images, audio, video, and code simultaneously). They utilize advanced transformer architectures optimized for huge context windows (up to 2 million tokens in Gemini 1.5 Pro).

### Code Example
Below is a simple comparison concept illustrating how predictive text works at a high level.
```python
import numpy as np

# A simplified concept of predicting the next word based on probability
words = ["AI", "applications", "are", "intelligent", "agents"]
context = "AI applications are"

# Simple transition probability representation
probabilities = {
    "AI": [0.1, 0.7, 0.1, 0.05, 0.05],
    "applications": [0.05, 0.05, 0.8, 0.05, 0.05],
    "are": [0.02, 0.03, 0.05, 0.4, 0.5], # 'intelligent' (40%) or 'agents' (50%)
}

next_word_probs = probabilities["are"]
predicted_index = np.argmax(next_word_probs)
next_word = words[predicted_index]

print(f"Context: {context}")
print(f"Predicted Next Word: {next_word}")
```
**Output:**
```text
Context: AI applications are
Predicted Next Word: agents
```

### Practice & Assignment
**Practice Exercise**: Research the differences between Gemini 1.5 Flash and Gemini 1.5 Pro. List their token limits and ideal industrial use-cases in a table.
**Assignment**: Explain why native multimodality is superior to combining separate single-modality models (e.g., combining Whisper for audio, YOLO for image, and GPT-4 for text).

### Summary
Generative AI represents a paradigm shift from analytical AI (which classifies or predicts numbers) to creative AI (which creates high-entropy content). At the center of this shift is the Transformer architecture, which powers models like Google Gemini.
"""
                    },
                    {
                        "id": "prompt_eng_basics",
                        "title": "Introduction to Prompt Engineering",
                        "content": """
### Overview
Prompt engineering is the art and science of formulating queries to guide Large Language Models (LLMs) to generate accurate, helpful, and structured outputs.

### Objectives
- Define what a prompt is and why it's the interface of the future.
- Explain the role of tokens and temperature settings.
- Write direct, clear instructions for deterministic outputs.

### Real-world Analogy
Imagine delegating a task to an extremely smart but completely context-blind intern. If you simply say *"Write a report on sales,"* they don't know the audience, the format, the timeframe, or the tone. If you say, *"Acting as our Senior Financial Analyst, write a 3-paragraph summary of our Q2 sales growth, formatted with bullet points for each region, keeping the tone professional,"* the intern will deliver exactly what you need.

**Example Analogy for Temperature settings:**
Think of the LLM as an **Improv Actor**. 
- **Low Temperature (0.0 - 0.2)**: The actor plays a rigid accountant. They stick strictly to the script, give very predictable answers, and never go off on creative tangents. Perfect for math and coding tasks.
- **High Temperature (0.8 - 1.0+)**: The actor plays an eccentric poet. They take wild leaps of imagination, hallucinate vivid details, and invent new words. Perfect for brainstorming and creative storytelling.

### Detailed Explanation
A prompt is the input text sent to an LLM. Prompt engineering optimizes this input. Key parameters that influence how the model interprets your prompt include:
- **Temperature**: Controls randomness. `0.0` makes the output deterministic (great for coding/math), while `0.8+` makes it highly creative (great for brainstorming).
- **Top-K and Top-P**: Filters the token probability list to select the most probable words.

[DIAGRAM: PROMPT_FLOW]

### Prompting Principles
1. **Be Specific**: Specify length, tone, format, and context.
2. **Use Delimiters**: Use triple backticks (```) or XML tags (`<context></context>`) to separate instructions from data.
3. **Specify the Output Format**: Ask for JSON, Markdown, or HTML explicitly.

### Code Example
```python
# System prompt and User prompt structuring pattern
system_instruction = "You are a professional code reviewer. Provide feedback in a clean Markdown table."
user_prompt = "Review this Python function:\n\ndef add(a, b):\n  return a+b"

full_prompt = f"<system>{system_instruction}</system>\n<user>{user_prompt}</user>"
print(full_prompt)
```

### Common Mistakes
- **Vagueness**: Avoid writing "make it good" or "summarize this". Specify *exactly* what "good" means (e.g., "concise, 3 bullets").
- **Over-constraining**: Giving contradictory instructions (e.g., "write a comprehensive 10,000-word essay in 1 paragraph").

### Summary
By adjusting context, constraints, and instructions, prompt engineering acts as the programming language for LLMs.
"""
                    }
                ]
            },
            {
                "id": "day1_mod2",
                "title": "Gemini API integration",
                "topics": [
                    {
                        "id": "gemini_api_setup",
                        "title": "Setting up the Google GenAI SDK",
                        "content": """
### Overview
To build software applications powered by Gemini, you must integrate Google's Developer APIs. In this topic, we will walk through authentication, installing the official SDK, and initializing your first connection.

### Objectives
- Create a Google AI Studio API key.
- Install the `google-genai` Python library.
- Configure environment variables for secure authentication.

### Real-world Analogy
An API Key is like a **VIP Access Badge** for an amusement park. The park is Google's supercomputer infrastructure. When you show your badge (API Key), the gates open, and you can ride the rollercoasters (generate text, analyze images, run code).

### Step-by-Step API Key Setup
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account.
3. Click on the **"Get API key"** button on the left sidebar.
4. Click **"Create API key"** and select a project.
5. Copy the key and save it securely. Do NOT commit this key to GitHub!

### Code Example: Authentication & Text Generation
```python
import os
# Recommended Google GenAI SDK (released late 2024 / 2025)
# Install via: pip install google-genai
from google import genai

# Setup environment variable: export GEMINI_API_KEY="your-api-key"
# The client automatically picks up the GEMINI_API_KEY environment variable.
client = genai.Client()

response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Explain Quantum Computing in three sentences to a 10-year-old.',
)

print(response.text)
```

### Output
```text
Quantum computing is a new type of computer that uses the rules of quantum physics to solve complex problems much faster than normal computers. Instead of using regular bits that are either 0 or 1, they use qubits which can be both at the same time. This lets them think about millions of possibilities all at once, like finding a way out of a giant maze in a single second.
```

### Practice & Assignment
**Exercise**: Create a Python script that takes a user query from the terminal, sends it to `gemini-1.5-flash`, and prints the response in a styled loop.
**Assignment**: Explain why storing API keys directly in source code is a high-risk security vulnerability. Write a guide on using `.env` files with `python-dotenv`.
"""
                    },
                    {
                        "id": "gemini_multimodal",
                        "title": "Multimodal Applications (Chat, Vision, Audio)",
                        "content": """
### Overview
Gemini is natively multimodal. This means it doesn't just read text and convert files; it natively processes pixel coordinates, waveforms, and time series data. In this topic, we cover vision, multi-turn chat, and streaming.

### Objectives
- Build a multi-turn chat session with message history.
- Send images alongside text queries for visual recognition.
- Implement token streaming for instantaneous UI responses.

### Detailed Explanation
In traditional LLMs, images or audio are converted into text descriptions using separate models before being fed to the LLM. In Gemini, the neural network architecture inputs text tokens, image pixels, and audio frames into the same hidden layers, preserving rich spatial and auditory context.

### Code Example: Vision & Multi-turn Chat
```python
from google import genai
from google.genai import types
import PIL.Image

client = genai.Client()

# 1. Visual Analysis
img = PIL.Image.open("architecture_diagram.png")
vision_response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents=[img, 'List all the databases shown in this architecture and their roles.']
)
print("--- Vision Analysis ---")
print(vision_response.text)

# 2. Multi-turn Chat
chat = client.chats.create(model="gemini-1.5-flash")
print("\n--- Chat Session ---")
response1 = chat.send_message("Hi, I want to learn LangGraph.")
print(f"Student: Hi, I want to learn LangGraph.\nGemini: {response1.text}\n")
response2 = chat.send_message("What is its core concept?")
print(f"Student: What is its core concept?\nGemini: {response2.text}")
```

### Practice
**Practice Task**: Build a script that opens your webcam, captures a photo, and asks Gemini to identify the objects in the room.
"""
                    }
                ]
            },
            {
                "id": "day1_mod3",
                "title": "Advanced Prompt Engineering",
                "topics": [
                    {
                        "id": "advanced_techniques",
                        "title": "Few-Shot, CoT, and Structured JSON Outputs",
                        "content": """
### Overview
Standard prompting works for basic tasks. But for complex reasoning, classification, and API integrations, we need advanced structures like Few-Shot prompting, Chain of Thought (CoT), and schema-enforced structured JSON output.

### Objectives
- Implement Few-Shot prompting for custom text classification.
- Apply Chain of Thought (CoT) prompting to solve logical problems.
- Force Gemini to output data matching a specific Pydantic schema.

### Real-world Analogy
- **Few-Shot**: Showing a kid three examples of a "good drawing" and a "bad drawing" before asking them to grade a new one. *Example:* "Here are 3 tweets and their sentiment (Positive/Negative). Now grade this 4th tweet."
- **Chain of Thought**: A math teacher writing out *"1. Solve parentheses, 2. Multiply, 3. Add"* on the board, teaching students to write down intermediate steps rather than just blurt out an incorrect final answer. *Example:* "Let's think step by step. First, identify the key entities in the paragraph. Second, evaluate their relationships. Finally, generate the summary."

### Detailed Explanation & Structured Output
When integrating LLMs into software pipelines, you cannot rely on loose markdown or English sentences. You need clean JSON. Google Gemini allows you to pass a Pydantic schema or raw JSON schema to enforce that the returned text conforms exactly to your backend data requirements.

### Code Example: Schema-Enforced JSON Output
```python
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# 1. Define the structure
class EntityExtractor(BaseModel):
    company_name: str = Field(description="Name of the company mentioned")
    products: List[str] = Field(description="List of products or services mentioned")
    sentiment: str = Field(description="Sentiment score: POSITIVE, NEUTRAL, or NEGATIVE")
    confidence: float = Field(description="Confidence rating from 0.0 to 1.0")

client = genai.Client()

# 2. Query Gemini and request JSON structured output
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='Google released their new Gemini 1.5 Flash model yesterday, which will make their AI Studio suite highly competitive.',
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=EntityExtractor,
    ),
)

print(response.text)
```

### Output
```json
{
  "company_name": "Google",
  "products": ["Gemini 1.5 Flash", "AI Studio"],
  "sentiment": "POSITIVE",
  "confidence": 0.95
}
```

### Summary
Enforcing Pydantic schemas in Gemini eliminates parsing errors, making LLMs highly reliable for database storage and backend microservices.
"""
                    }
                ]
            },
            {
                "id": "day1_mod4",
                "title": "Building UIs with Streamlit",
                "topics": [
                    {
                        "id": "streamlit_intro",
                        "title": "Streamlit Basics and LLM Integrations",
                        "content": """
### Overview
Building command-line scripts is fine for development, but users need visual interfaces. **Streamlit** is an open-source Python library that lets you build gorgeous, interactive web apps for machine learning and AI in minutes.

### Objectives
- Create a interactive form using Streamlit inputs.
- Maintain conversation memory in Streamlit using `st.session_state`.
- Connect Streamlit inputs directly to Gemini APIs.

### Code Example: Complete Chat Application
Here is a functional, single-file Streamlit app that implements a responsive Gemini Chat interface with active session memory:

```python
import streamlit as st
import os
from google import genai

# Setup page
st.set_page_config(page_title="Gemini AI Companion", page_icon="🤖", layout="centered")
st.title("🤖 Gemini AI Companion")
st.caption("Powered by Gemini 1.5 Flash")

# Initialize Gemini Client
@st.cache_resource
def get_client():
    return genai.Client()

# Initialize Chat Session
if "chat" not in st.session_state:
    client = get_client()
    st.session_state.chat = client.chats.create(model="gemini-1.5-flash")
    st.session_state.messages = []

# Display message history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User Input
if user_input := st.chat_input("Ask me anything..."):
    # Add to history
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Generate response
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chat.send_message(user_input)
            st.markdown(response.text)
            st.session_state.messages.append({"role": "assistant", "content": response.text})
```

### Deployment Guide
1. Save the code above to a file named `app.py`.
2. Install requirements: `pip install streamlit google-genai`.
3. Set your API Key: `export GEMINI_API_KEY="your-api-key"` (or set it in Windows environment variables).
4. Run: `streamlit run app.py`.
5. Open `http://localhost:8501` in your browser.
"""
                    }
                ]
            },
            {
                "id": "day1_mod5",
                "title": "LangChain Foundations",
                "topics": [
                    {
                        "id": "langchain_basics",
                        "title": "Chains, Prompts, and Memory in LangChain",
                        "content": """
### Overview
While the raw SDK works for basic requests, building complex applications requires a framework. **LangChain** is the industry-standard library that simplifies constructing LLM applications by offering reusable abstractions for prompts, models, memory, chains, and agents.

### Objectives
- Define LangChain's core concepts: Prompts, LLMs, and Chains.
- Learn LangChain Expression Language (LCEL) syntax.
- Build a chain that processes structured text.

### Detailed Explanation
LangChain divides LLM workflows into modular nodes:
- **PromptTemplates**: Reusable instructions where variables are injected dynamically.
- **ChatModels**: Abstracted wrappers around LLM APIs (like Gemini's API).
- **OutputParsers**: Clean converters that turn LLM text outputs into dictionary formats or models.
- **LCEL (LangChain Expression Language)**: A declarative way to chain components together using the pipe operator (`|`).

### Code Example: LCEL Chain
```python
# Install: pip install langchain-google-genai langchain-core
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Initialize the LLM (using LangChain's Gemini Wrapper)
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# 2. Design Prompt Template
prompt = ChatPromptTemplate.from_template(
    "You are a professional chef. Suggest a signature recipe using these ingredients: {ingredients}."
)

# 3. Create Chain using LCEL (Pipe Syntax)
chain = prompt | llm | StrOutputParser()

# 4. Invoke the chain
recipe = chain.invoke({"ingredients": "eggs, tomatoes, and goat cheese"})
print(recipe)
```
"""
                    }
                ]
            }
        ],
        "quiz": {
            "id": "day1_quiz",
            "title": "Day 1 Quiz: GenAI & Application Development",
            "questions": [
                {
                    "id": 1,
                    "type": "mcq",
                    "question": "Which architecture forms the core foundation of modern Large Language Models (LLMs)?",
                    "options": ["Convolutional Neural Networks (CNN)", "Recurrent Neural Networks (RNN)", "Transformer Architecture", "Generative Adversarial Networks (GAN)"],
                    "answer": "Transformer Architecture",
                    "explanation": "The Transformer architecture, introduced by Google researchers in 2017 ('Attention Is All You Need'), is the foundational architecture of all modern LLMs, including GPT, Gemini, and Claude, due to its self-attention mechanism and capability for parallel training."
                },
                {
                    "id": 2,
                    "type": "mcq",
                    "question": "What is the primary feature of Google's Gemini models compared to traditional language models?",
                    "options": ["They are faster but only process English text.", "They are built from the ground up to be natively multimodal.", "They only run on local microcontrollers.", "They do not require API keys."],
                    "answer": "They are built from the ground up to be natively multimodal.",
                    "explanation": "Gemini was designed from the beginning to natively understand and combine text, images, video, audio, and code without using separate pipelines for each format."
                },
                {
                    "id": 3,
                    "type": "mcq",
                    "question": "Which of the following temperatures makes an LLM's outputs the most deterministic?",
                    "options": ["1.2", "0.8", "0.5", "0.0"],
                    "answer": "0.0",
                    "explanation": "A temperature of 0.0 makes the model choose the single most probable token at every step, creating consistent, deterministic outputs, which is ideal for mathematics, code compilation, and structured data generation."
                },
                {
                    "id": 4,
                    "type": "mcq",
                    "question": "What is Few-Shot Prompting?",
                    "options": ["Writing a prompt in less than 10 words.", "Providing a few input-output examples in the prompt to teach the model a task.", "Forcing the model to reply in a few sentences.", "Running a model on a device with limited GPU memory."],
                    "answer": "Providing a few input-output examples in the prompt to teach the model a task.",
                    "explanation": "Few-Shot Prompting includes input-output pairs in the context of the prompt, showing the model what constitutes a successful response before asking it to analyze the final, unseen input."
                },
                {
                    "id": 5,
                    "type": "mcq",
                    "question": "In the new Google GenAI SDK, which method is used to send a prompt to the model 'gemini-1.5-flash'?",
                    "options": ["client.send_prompt()", "client.models.generate_content()", "client.models.ask()", "client.chat.complete()"],
                    "answer": "client.models.generate_content()",
                    "explanation": "The official method in the updated Google GenAI Python SDK is `client.models.generate_content(model=..., contents=...)`."
                },
                {
                    "id": 6,
                    "type": "mcq",
                    "question": "What is the purpose of specifying 'response_mime_type=\"application/json\"' when calling Gemini?",
                    "options": ["To compress the communication payload.", "To force the model to respond in structured JSON format.", "To download the response as a file.", "To translate the prompt to Javascript."],
                    "answer": "To force the model to respond in structured JSON format.",
                    "explanation": "Setting the response MIME type to 'application/json' instructs the Gemini model to format its output strictly as valid JSON data, making parsing in backend scripts reliable."
                },
                {
                    "id": 7,
                    "type": "mcq",
                    "question": "What state management mechanism does Streamlit use to keep track of user variables across page updates?",
                    "options": ["st.db_state", "st.local_storage", "st.session_state", "st.cache_data"],
                    "answer": "st.session_state",
                    "explanation": "Streamlit runs the entire script from top to bottom on every user interaction. To maintain state (such as chat history or user inputs), developer must use `st.session_state`."
                },
                {
                    "id": 8,
                    "type": "mcq",
                    "question": "What does the pipe operator '|' represent in LangChain Expression Language (LCEL)?",
                    "options": ["Logical OR condition.", "Bitwise division.", "Chaining components, piping the output of one component as the input to the next.", "Concatenating strings."],
                    "answer": "Chaining components, piping the output of one component as the input to the next.",
                    "explanation": "In LCEL, the pipe operator `|` chains different runnables. For example, `prompt | llm | output_parser` pipes prompt formatting output into the language model, and then pipes the result into a clean parser."
                },
                {
                    "id": 9,
                    "type": "mcq",
                    "question": "Which LangChain component is used to format raw user parameters into structured instructions for the LLM?",
                    "options": ["PromptTemplate", "SystemConnector", "DataFormatter", "MemoryBuffer"],
                    "answer": "PromptTemplate",
                    "explanation": "A PromptTemplate allows developers to define a reusable template string (e.g. 'Summarize this {text}') and inject inputs dynamically to construct the final prompt."
                },
                {
                    "id": 10,
                    "type": "mcq",
                    "question": "How do you specify a system instruction parameter in the Google GenAI SDK's generate_content call?",
                    "options": ["By prefixing the prompt with 'system:'", "Inside config=types.GenerateContentConfig(system_instruction=...)", "Inside client.models.system_instruction(Text)", "It is not supported by Gemini."],
                    "answer": "Inside config=types.GenerateContentConfig(system_instruction=...)",
                    "explanation": "System instructions are passed inside the `config` parameter of `generate_content` using the `GenerateContentConfig` object."
                }
            ]
        },
        "project": {
            "id": "day1_project",
            "title": "AI Resume Analyzer",
            "problem": "HR recruiters spend hours manual screening resumes. You need to build a Streamlit dashboard that allows recruiters to upload a PDF resume, uses Gemini's vision capability to parse details, extracts structured data (candidate name, email, skills, experience), matches them against a Job Description, and generates a rating (0-100) with a feedback report.",
            "architecture": "Upload PDF -> Convert PDF pages to PIL Images -> Send to Gemini 1.5 Flash -> Extract Pydantic Schema JSON -> Match with Job Description -> Render Dashboard.",
            "workflow": "1. User uploads PDF resume.\n2. PDF is processed (via pdf2image or PyPDF2).\n3. Visual layout is analyzed by Gemini API.\n4. Extraction schema checks for structured keys.\n5. Match scoring calculates alignment.\n6. UI displays gauges, summaries, and downloadable PDF feedback reports.",
            "folder_structure": "ai_resume_analyzer/\n├── app.py\n├── requirements.txt\n├── utils.py\n└── README.md",
            "steps": "1. Set up virtual environment and install requirements: streamlit, google-genai, pypdf, python-dotenv.\n2. Create Pydantic model for CandidateInfo in utils.py.\n3. Implement PDF text parsing utility in utils.py.\n4. Build UI components in app.py (file upload, text area for JD, action buttons).\n5. Integrate Gemini API with structured response config.\n6. Display candidate profiles, match scores, and recommendations in cards.",
            "code": """
# Example core implementation for app.py
import streamlit as st
import os
from pydantic import BaseModel, Field
from typing import List
from google import genai
from google.genai import types
import pypdf

# Define extraction structure
class ResumeAnalysis(BaseModel):
    candidate_name: str = Field(description="Full name of the candidate")
    email: str = Field(description="Email address")
    skills: List[str] = Field(description="Key technical skills listed")
    years_experience: float = Field(description="Total years of work experience")
    match_score: int = Field(description="Score from 0 to 100 indicating alignment with job description")
    strengths: List[str] = Field(description="Top 3 candidate strengths")
    gaps: List[str] = Field(description="Areas where candidate lacks skills required by JD")
    recommendation: str = Field(description="Short hire/no-hire decision justification")

st.set_page_config(page_title="AI Resume Analyzer", layout="wide")
st.title("📄 AI Resume Analyzer & Job Fit Assessor")

jd_input = st.text_area("Paste Job Description (JD) here:", height=150)
uploaded_file = st.file_uploader("Upload Resume (PDF only):", type="pdf")

if st.button("Analyze Resume") and uploaded_file and jd_input:
    # 1. Parse PDF
    reader = pypdf.PdfReader(uploaded_file)
    resume_text = ""
    for page in reader.pages:
        resume_text += page.extract_text()
        
    # 2. Setup Gemini
    client = genai.Client()
    
    prompt = f\"\"\"
    Analyze this resume text:
    ---
    {resume_text}
    ---
    Compare it against this Job Description:
    ---
    {jd_input}
    ---
    Extract candidate profile details and assess job fit.
    \"\"\"
    
    with st.spinner("Analyzing candidate alignment..."):
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ResumeAnalysis,
                system_instruction="You are an expert HR recruitment parser. Grade candidates objectively."
            )
        )
        
        # Parse output
        import json
        data = json.loads(response.text)
        
        # Display output in beautiful cards
        col1, col2 = st.columns([1, 2])
        with col1:
            st.metric("Match Score", f"{data['match_score']}%")
            st.write(f"**Name:** {data['candidate_name']}")
            st.write(f"**Email:** {data['email']}")
            st.write(f"**Experience:** {data['years_experience']} years")
        with col2:
            st.subheader("Skills Identified")
            st.write(", ".join(data['skills']))
            
            col_g, col_s = st.columns(2)
            with col_g:
                st.success("💪 Strengths")
                for s in data['strengths']:
                    st.write(f"- {s}")
            with col_s:
                st.warning("⚠️ Gaps")
                for g in data['gaps']:
                    st.write(f"- {g}")
                    
            st.info(f"**Recommendation:** {data['recommendation']}")
""",
            "explanation": "This code uses `pypdf` to extract raw text content from the uploaded resume file, builds a prompt combining the resume text and the job description, and requests a schema-enforced response from Gemini 1.5 Flash. The output is structured JSON matching the `ResumeAnalysis` Pydantic class, which Streamlit parses and displays instantly in premium cards and metrics."
        }
    },
    "day2": {
        "title": "Knowledge Assistants",
        "modules": [
            {
                "id": "day2_mod1",
                "title": "Retrieval-Augmented Generation (RAG)",
                "topics": [
                    {
                        "id": "rag_concepts",
                        "title": "The RAG Architecture: Embeddings & Retrievers",
                        "content": """
### Overview
LLMs are trained on public data up to a specific cutoff. They do not know about your private company reports, internal databases, or real-time documentation. **Retrieval-Augmented Generation (RAG)** solves this by retrieving relevant text chunks from a private document database and injecting them into the prompt before sending it to the LLM.

### Objectives
- Define the core steps of RAG (Chunk, Embed, Index, Retrieve, Generate).
- Understand text embeddings and vector spaces.
- Contrast dense retrieval with lexical keywords search.

### Real-world Analogy
Imagine taking a closed-book history exam. You have to memorize everything, and you might make up details (hallucination) if you forget. Now, imagine an **open-book exam**. A librarian (the retriever) searches the library, finds the exact 3 pages containing the answers, photocopies them, and hands them to you. You (the LLM) read those pages and write a perfect, fact-checked answer. This is RAG!

**Example Analogy for Embeddings:**
Think of embeddings as a **Supermarket Aisle System**. Apples and Oranges are placed in the "Produce" section (close to each other in vector space). Milk and Cheese are in "Dairy" (far from Produce, but close to each other). If a customer asks for "Cheddar", the database knows it's semantically close to "Cheese", so it retrieves the Dairy items.

### Detailed Explanation
RAG operates in two main phases:
1. **Ingestion (Offline)**: 
   - **Document Parsing**: Read PDFs, HTML files, or markdown files.
   - **Chunking**: Split long documents into small, manageable passages (e.g., 500 characters with 50 characters overlap) so the semantic meaning is preserved.
   - **Embeddings**: Convert each text chunk into a high-dimensional vector (a list of floating-point numbers like `[-0.02, 0.45, -0.12, ...]`) using an embedding model. These vectors represent semantic meaning: similar concepts sit close to each other in vector space.
   - **Indexing**: Store the vectors and their source text chunks in a **Vector Database**.
2. **Retrieval & Generation (Online)**:
   - **Query Embedding**: Convert the user's question into a vector using the same embedding model.
   - **Similarity Search**: Perform a cosine similarity or dot product search to find the top $k$ closest vectors in the vector database.
   - **Augmentation**: Inject the source text chunks corresponding to those vectors into the prompt as "Context".
   - **Generation**: Send the augmented prompt to Gemini to write the final answer.

[DIAGRAM: RAG_FLOW]

### Code Example: Embeddings with Gemini API
```python
from google import genai

client = genai.Client()

# Generate embeddings for text chunks
response = client.models.embed_content(
    model="text-embedding-004",
    contents=[
        "LangGraph is a library for building stateful, multi-actor applications with LLMs.",
        "ChromaDB is an open-source vector database designed for AI developers."
    ]
)

# Each text chunk is converted to a vector of 768 dimensions
for i, embedding in enumerate(response.embeddings):
    print(f"Chunk {i+1} Vector Dimension: {len(embedding.values)}")
    print(f"First 5 values: {embedding.values[:5]}")
```
"""
                    }
                ]
            },
            {
                "id": "day2_mod2",
                "title": "Vector Databases with ChromaDB",
                "topics": [
                    {
                        "id": "chromadb_basics",
                        "title": "Storing and Querying with ChromaDB",
                        "content": """
### Overview
To index and retrieve embeddings efficiently, we use a specialized database: a **Vector Database**. In this topic, we will use **ChromaDB**, a lightweight, open-source vector database that can run locally inside your Python application.

### Objectives
- Create a local ChromaDB collection.
- Upsert documents with metadata.
- Perform semantic queries to retrieve top documents.

### Code Example: Local ChromaDB Operations
```python
# Install: pip install chromadb
import chromadb

# Initialize local persistent client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Create a collection. ChromaDB has a default embedding model (SentenceTransformers)
# but we can also supply custom embedding functions.
collection = chroma_client.get_or_create_collection(name="workshop_guidelines")

# Add documents
collection.add(
    documents=[
        "Students need 80% attendance to qualify for the workshop certificate.",
        "Day 1 project submission is due before Day 2 classes start.",
        "The Capstone project requires students to submit both code and a hosted demo."
    ],
    ids=["doc1", "doc2", "doc3"],
    metadatas=[{"type": "attendance"}, {"type": "deadline"}, {"type": "capstone"}]
)

# Query the collection
results = collection.query(
    query_texts=["Is there an attendance requirement?"],
    n_results=1
)

print("Query: Is there an attendance requirement?")
print(f"Found document: {results['documents'][0][0]}")
print(f"Similarity Distance: {results['distances'][0][0]}")
```
"""
                    }
                ]
            },
            {
                "id": "day2_mod3",
                "title": "Stateful Orchestration with LangGraph",
                "topics": [
                    {
                        "id": "langgraph_foundations",
                        "title": "Nodes, Edges, State, and Conditional Logic",
                        "content": """
### Overview
Standard LangChain works for linear pipelines. But complex AI applications don't work in straight lines; they require **cycles, loops, and conditional decision-making**. **LangGraph** allows you to build stateful, multi-actor applications by representing workflows as graphs.

### Objectives
- Understand Graph Components: State, Nodes, and Edges.
- Build a graph with looping decision structures.
- Map graph execution outputs.

### Detailed Explanation
- **State**: A shared memory structure (usually a dictionary or Pydantic model) that is passed between nodes and modified.
- **Nodes**: Standard Python functions that receive the current State, perform work (like calling an LLM), and return updated State variables.
- **Edges**: Connect nodes. They can be:
  - **Normal Edges**: Always point from Node A to Node B.
  - **Conditional Edges**: Run a decision function to determine if the next node should be Node B, Node C, or if the process should `__end__`.

[DIAGRAM: LANGGRAPH_FLOW]

### Code Example: A Stateful Router Graph
```python
# Install: pip install langgraph
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END

# 1. Define the State
class GraphState(TypedDict):
    question: str
    category: str
    answer: str

# 2. Define Nodes (Work Units)
def classify_question(state: GraphState):
    # Mock classifier logic (real world would call Gemini)
    q = state["question"].lower()
    category = "technical" if "code" in q or "error" in q else "general"
    return {"category": category}

def handle_technical(state: GraphState):
    return {"answer": "Parsing code logs... Let's review the stack trace."}

def handle_general(state: GraphState):
    return {"answer": "Greeting! How can I help you learn today?"}

# 3. Define Conditional Router
def route_decision(state: GraphState) -> Literal["technical", "general"]:
    return state["category"]

# 4. Build the Graph
workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("classify", classify_question)
workflow.add_node("technical", handle_technical)
workflow.add_node("general", handle_general)

# Add Edges
workflow.add_edge(START, "classify")
workflow.add_conditional_edges(
    "classify",
    route_decision,
    {
        "technical": "technical",
        "general": "general"
    }
)
workflow.add_edge("technical", END)
workflow.add_edge("general", END)

# Compile Graph
app = workflow.compile()

# Run the Graph
result = app.invoke({"question": "Help, my code is throwing a SyntaxError!"})
print(f"Question Category: {result['category']}")
print(f"Response: {result['answer']}")
```
"""
                    }
                ]
            },
            {
                "id": "day2_mod4",
                "title": "Multi-Agent Frameworks with CrewAI",
                "topics": [
                    {
                        "id": "crewai_basics",
                        "title": "Role-Playing Agents, Tasks, and Crews",
                        "content": """
### Overview
For complex tasks, a single LLM might lose focus. **CrewAI** is a framework for orchestrating role-playing autonomous agents. By dividing a task among multiple agents (each with its own role, goal, backstory, and tools), you can run complex, collaborative workflows.

### Objectives
- Define CrewAI Agents, Tasks, and Crews.
- Create role-playing prompts using Agent Backstories.
- Implement sequential workflows between agents.

### Real-world Analogy
Imagine writing a research paper. Instead of doing everything yourself, you hire a team:
- **Research Agent**: Goes to the library, searches the web, gathers raw sources.
- **Writer Agent**: Reads the research, drafts a cohesive article.
- **Editor Agent**: Proofreads the article, fixes styling, formats references.
Each person does what they are best at, passing the document down the line. That's a Crew!

**Example Analogy for Tasks and Processes:**
Think of a **Restaurant Kitchen**. The `Process.sequential` is like an assembly line: The prep cook (Agent 1) chops the vegetables (Task 1). The chef (Agent 2) cooks the meal (Task 2). The waiter (Agent 3) delivers it (Task 3). If any agent drops their task, the chain breaks!

[DIAGRAM: CREWAI_FLOW]

### Code Example: Writing Assistant Crew
```python
# Install: pip install crewai
import os
from crewai import Agent, Task, Crew, Process

# 1. Define Agents with Roles, Goals, and Backstory
researcher = Agent(
    role="AI Trend Researcher",
    goal="Identify the top 3 rising trends in Agentic AI for 2026.",
    backstory="You are a technology analyst at a leading VC firm. You excel at spotting patterns.",
    allow_delegation=False,
    verbose=True
)

writer = Agent(
    role="Tech Writer",
    goal="Draft an engaging, non-technical blog post about the trends.",
    backstory="You are a veteran tech blogger. You write stories that make complex systems simple.",
    allow_delegation=False,
    verbose=True
)

# 2. Define Tasks
task1 = Task(
    description="Research and output 3 bullet points on Agentic AI trends.",
    expected_output="A bulleted list containing trend names and 2-sentence descriptions.",
    agent=researcher
)

task2 = Task(
    description="Write a 300-word newsletter based on the researcher's output.",
    expected_output="A newsletter article with a catchy headline.",
    agent=writer
)

# 3. Assemble the Crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[task1, task2],
    process=Process.sequential,  # Sequential execution
    verbose=True
)

# Run the crew
# result = crew.kickoff()
print("Crew compiled successfully. Run crew.kickoff() to start execution.")
```
"""
                    }
                ]
            }
        ],
        "quiz": {
            "id": "day2_quiz",
            "title": "Day 2 Quiz: Knowledge Assistants & Agents",
            "questions": [
                {
                    "id": 1,
                    "type": "mcq",
                    "question": "What does the 'R' in RAG stand for?",
                    "options": ["Reasoning", "Retrieval", "Recursive", "Random"],
                    "answer": "Retrieval",
                    "explanation": "RAG stands for Retrieval-Augmented Generation, meaning that we retrieve documents from external stores to augment the prompt before generating response."
                },
                {
                    "id": 2,
                    "type": "mcq",
                    "question": "In the RAG process, what is the role of an embedding model?",
                    "options": ["To translate text into Spanish.", "To break documents into paragraphs.", "To convert text chunks into high-dimensional vectors representing semantic meaning.", "To store PDFs on the local drive."],
                    "answer": "To convert text chunks into high-dimensional vectors representing semantic meaning.",
                    "explanation": "Embedding models convert text strings into numerical vectors (lists of floats) that place words with similar meanings close together in a coordinate space."
                },
                {
                    "id": 3,
                    "type": "mcq",
                    "question": "Which database is specifically optimized to perform similarity searches on vectors?",
                    "options": ["PostgreSQL", "ChromaDB", "Redis", "SQLite"],
                    "answer": "ChromaDB",
                    "explanation": "ChromaDB is a specialized vector database designed to index and query vector embeddings efficiently, supporting cosine similarity searches."
                },
                {
                    "id": 4,
                    "type": "mcq",
                    "question": "What is 'chunking' in RAG ingestion?",
                    "options": ["Compressing a database into a zip file.", "Splitting large documents into smaller text segments to fit inside the LLM context window and preserve relevance.", "Encrypting user passwords.", "Running the LLM in parallel threads."],
                    "answer": "Splitting large documents into smaller text segments to fit inside the LLM context window and preserve relevance.",
                    "explanation": "Chunking splits large documents into smaller, overlapping chunks (e.g. 500 characters) to optimize retrieval relevance and avoid exceeding context limits."
                },
                {
                    "id": 5,
                    "type": "mcq",
                    "question": "How does LangGraph store and share data across different tasks in a workflow graph?",
                    "options": ["In a global MySQL database.", "Using environment variables.", "In a central 'State' structure passed from node to node.", "By writing temporary JSON files to disk."],
                    "answer": "In a central 'State' structure passed from node to node.",
                    "explanation": "LangGraph relies on a shared state (dict or Pydantic model) that accumulates keys and is passed through each executing node."
                },
                {
                    "id": 6,
                    "type": "mcq",
                    "question": "What type of edge in LangGraph runs a router function to decide which node to visit next?",
                    "options": ["Dynamic Edge", "Conditional Edge", "Switch Edge", "Route Edge"],
                    "answer": "Conditional Edge",
                    "explanation": "A conditional edge determines the execution path based on a router function's return value, routing to different destinations."
                },
                {
                    "id": 7,
                    "type": "mcq",
                    "question": "Which CrewAI concept defines an agent's motivation, setting up its personality and context?",
                    "options": ["Goal", "Backstory", "Backbone", "SystemPrompt"],
                    "answer": "Backstory",
                    "explanation": "The 'backstory' parameter in CrewAI defines the persona, background, and expert context of the agent, guiding its prompting."
                },
                {
                    "id": 8,
                    "type": "mcq",
                    "question": "In CrewAI, what is the default process model where tasks are executed one after the other in a sequence?",
                    "options": ["Process.hierarchical", "Process.parallel", "Process.sequential", "Process.random"],
                    "answer": "Process.sequential",
                    "explanation": "Process.sequential executes tasks in the exact order they are defined in the task array, feeding output from one as context to the next."
                },
                {
                    "id": 9,
                    "type": "mcq",
                    "question": "What is the similarity distance metric typically used to query vector collections?",
                    "options": ["Euclidean distance or Cosine similarity", "Levenstein edit distance", "MD5 Hash matching", "Binary lookup"],
                    "answer": "Euclidean distance or Cosine similarity",
                    "explanation": "Vector databases utilize Cosine similarity, Inner Product (IP), or L2 (Euclidean) distance to evaluate closeness of text vectors."
                },
                {
                    "id": 10,
                    "type": "mcq",
                    "question": "Which of these is a major cause of hallucination in a basic RAG pipeline?",
                    "options": ["Using a database that is too fast.", "Retrieving irrelevant context chunks that confuse the LLM.", "Having high temperature settings.", "Using the Gemini API instead of open source models."],
                    "answer": "Retrieving irrelevant context chunks that confuse the LLM.",
                    "explanation": "If similarity search fetches noisy, irrelevant chunks, the LLM incorporates that noise and generates incorrect factual claims."
                }
            ]
        },
        "project": {
            "id": "day2_project",
            "title": "University Regulation Assistant",
            "problem": "University students struggle to find registration deadlines, exam criteria, and course requirements in complex 200-page academic PDF handbooks. You need to build a RAG knowledge assistant. The app must parse a sample university handbook, split it into chunks, index them in ChromaDB, and run a QA interface that answers student queries citing the exact document source.",
            "architecture": "Parse Academic PDF -> LangChain Text Splitter -> ChromaDB Storage -> Similarity Search Query -> Prompt Injection -> Gemini 1.5 Flash Answer.",
            "workflow": "1. Student asks a question (e.g. 'Can I drop a class after week 3?').\n2. Query is converted to embedding vector.\n3. ChromaDB extracts the top 3 relevant paragraphs.\n4. Context and question are merged in a prompt template.\n5. Gemini generates a structured response with citations.",
            "folder_structure": "academic_rag/\n├── ingest.py\n├── app.py\n├── handbook.pdf\n└── requirements.txt",
            "steps": "1. Install libraries: chromadb, langchain-community, langchain-google-genai, pypdf.\n2. Write ingest.py to load and slice the PDF handbook.\n3. Save chunks to local ChromaDB.\n4. Write app.py containing the Streamlit interface.\n5. Implement custom citation UI displaying source extracts.",
            "code": """
# Example core ingest and search code
import chromadb
from google import genai
import pypdf

# 1. Extraction & Ingestion
def ingest_pdf(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    chunks = []
    
    # Simple sliding window chunker
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()
        # Divide page into 400 char segments
        for i in range(0, len(text), 300):
            segment = text[i:i+400]
            if len(segment.strip()) > 50:
                chunks.append({
                    "text": segment,
                    "metadata": {"page": page_num + 1, "source": pdf_path}
                })
    return chunks

# 2. Embedding generation & Upsert
def store_in_chroma(chunks):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_or_create_collection("university_regs")
    
    client = genai.Client()
    
    # Store in batches
    for idx, chunk in enumerate(chunks):
        # Generate embedding
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=chunk["text"]
        )
        vector = response.embeddings[0].values
        
        collection.add(
            embeddings=[vector],
            documents=[chunk["text"]],
            metadatas=[chunk["metadata"]],
            ids=[f"chunk_{idx}"]
        )
    print("Ingestion completed!")

# 3. Retrieve and query function
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
    sources = results["metadatas"][0]
    
    # Generate Answer
    prompt = f\"\"\"
    You are an official University Academic Advisor. Answer the question using ONLY the context provided.
    If the answer cannot be found, say 'I cannot find this information in the official handbook.'
    
    Context:
    {context}
    
    Question: {question}
    \"\"\"
    
    ans_response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt
    )
    
    return ans_response.text, sources
""",
            "explanation": "The ingest phase chunks the PDF by page segments and generates vector representations using Google's `text-embedding-004` model, storing them in ChromaDB. When a query is received, the search embeds the question, computes vector similarity to fetch relevant chunks, and wraps the text in an academic adviser instruction template for Gemini to answer, attaching source citations."
        }
    },
    "day3": {
        "title": "Build Intelligent Agents",
        "modules": [
            {
                "id": "day3_mod1",
                "title": "Model Context Protocol (MCP)",
                "topics": [
                    {
                        "id": "mcp_architecture",
                        "title": "Understanding the Model Context Protocol",
                        "content": """
### Overview
The Model Context Protocol (MCP) is an open-source protocol (open-sourced by Anthropic in late 2024 and adopted industry-wide in 2025) that defines a standard interface for LLMs to securely interact with local systems, file directories, tools, databases, and APIs.

### Objectives
- Understand the 3 parts of MCP: Host, Client, and Server.
- Create an MCP Client that communicates with standard servers.
- Build a custom Python MCP Server to expose system shell commands safely.

### Detailed Explanation
Before MCP, every developer wrote custom code to connect LLMs to tools. If you wanted an LLM to search a file, you wrote a custom python script. If you wanted it to search a SQL Database, you wrote a SQL connector. MCP standardizes this. 

MCP architecture splits responsibilities:
- **Host**: The orchestrator application (like an IDE, terminal, or Slack bot) that routes LLM queries.
- **Client**: Connects to MCP servers, handles authentication and protocols.
- **Server**: Lightweight programs that expose specific inputs/outputs:
  - **Resources**: Read-only files, database schemas, or logs.
  - **Tools**: Executable functions (e.g. read_file, run_command, calculate).
  - **Prompts**: Reusable prompt templates.

[DIAGRAM: MCP_FLOW]

### Code Example: Building an MCP Server (Conceptual Python)
```python
# In 2025, Python MCP SDK lets you declare servers easily
# pip install mcp
from mcp.server.fastmcp import FastMCP

# Create a FastMCP Server
mcp = FastMCP("Math Server")

# Expose a function as an LLM tool
@mcp.tool()
def add_numbers(x: float, y: float) -> float:
    \"\"\"Add two numbers together. useful for calculator tasks.\"\"\"
    return x + y

@mcp.tool()
def get_system_load() -> str:
    \"\"\"Retrieve server CPU load.\"\"\"
    import psutil
    return f"CPU: {psutil.cpu_percent()}%"

if __name__ == "__main__":
    mcp.run()
```
"""
                    }
                ]
            },
            {
                "id": "day3_mod2",
                "title": "Agentic AI & Autonomy",
                "topics": [
                    {
                        "id": "agentic_principles",
                        "title": "Planning, Reflection, Memory, and Tool Calling",
                        "content": """
### Overview
What makes an LLM application an **Agent**? It's the capacity for **autonomous loops**. An agent doesn't just receive input and output text. It plans its steps, invokes tools, analyzes errors, reflects on results, and loops until the goal is achieved.

### Objectives
- Define the Agentic Loop: Plan -> Call Tool -> Observe -> Reflect -> Act.
- Implement short-term and long-term memory systems.
- Code a manual tool-calling loop using Gemini.

### The Agentic Loop
1. **Planning**: Breaking a big task ('Write a summary of stock prices') into sub-tasks.
2. **Tool Calling**: Invoking external APIs to fetch raw data.
3. **Observation**: Reviewing tool output ('Error 404: Stock not found').
4. **Reflection**: Figuring out what went wrong and adapting the plan ('Let me search by ticker name instead of full name').
5. **Execution**: Finishing the task once the criteria is met.

[DIAGRAM: AGENTIC_RAG]

### Code Example: Gemini Manual Tool Loop
```python
from google import genai
from google.genai import types

client = genai.Client()

# 1. Define Python tools
def get_weather(location: str) -> str:
    if "san francisco" in location.lower():
        return "Sunny, 68 degrees F."
    return "Cloudy, 50 degrees F."

# 2. Tell Gemini about the tools
response = client.models.generate_content(
    model='gemini-1.5-flash',
    contents='What is the weather like in San Francisco?',
    config=types.GenerateContentConfig(
        tools=[get_weather] # Register function
    )
)

# 3. Handle model function call request
function_calls = response.function_calls
if function_calls:
    for call in function_calls:
        print(f"Gemini requested tool: {call.name}")
        print(f"Arguments: {call.args}")
        
        # Execute tool locally
        if call.name == "get_weather":
            result = get_weather(**call.args)
            print(f"Tool execution result: {result}")
            
            # Send result back to Gemini to formulate final answer
            final_response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=[
                    'What is the weather like in San Francisco?',
                    response.candidates[0].content, # Original model response requesting call
                    types.Part.from_function_response(
                        name="get_weather",
                        response={"result": result}
                    )
                ]
            )
            print(f"Final Gemini Answer: {final_response.text}")
```
"""
                    }
                ]
            },
            {
                "id": "day3_mod3",
                "title": "Agentic RAG",
                "topics": [
                    {
                        "id": "agentic_rag_concepts",
                        "title": "Planner, Retriever, Reasoner, and Executor loops",
                        "content": """
### Overview
Traditional RAG is passive. It retrieves documents once and answers once. If the retrieved documents are bad, the answer is bad. **Agentic RAG** turns retrieval into an active loop. The agent can search multiple times, evaluate the relevance of retrieved text, fetch more data if needed, and rewrite the query if search results are poor.

### Objectives
- Define the Agentic RAG architecture.
- Understand self-correction and reflection in RAG.
- Implement a retrieval-grading agent.

[DIAGRAM: AGENTIC_RAG]

### Code Example: Retrieval Grader (Conceptual)
```python
# In Agentic RAG, we write a node that grades document relevance
def grade_documents(state):
    documents = state["documents"]
    question = state["question"]
    
    # Classify whether documents are relevant
    # If relevance score is low, transition graph back to 'web_search' or 'query_rewrite'
    # Otherwise, pass to 'generate'
    relevant_docs = []
    for doc in documents:
        # call LLM to evaluate relevance (Binary score: YES/NO)
        is_relevant = evaluate_relevance(doc, question)
        if is_relevant:
            relevant_docs.append(doc)
            
    if len(relevant_docs) == 0:
        return {"documents": relevant_docs, "action": "rewrite_query"}
    return {"documents": relevant_docs, "action": "generate_answer"}
```
"""
                    }
                ]
            }
        ],
        "quiz": {
            "id": "day3_quiz",
            "title": "Day 3 Quiz: Intelligent Agents & Capstone",
            "questions": [
                {
                    "id": 1,
                    "type": "mcq",
                    "question": "What does MCP stand for in modern AI engineering?",
                    "options": ["Model Context Protocol", "Multi-agent Control Portal", "Maximum Context Processing", "Machine Collaboration Program"],
                    "answer": "Model Context Protocol",
                    "explanation": "MCP stands for Model Context Protocol. It is an open standard designed to connect AI models safely to data sources, tools, and environments."
                },
                {
                    "id": 2,
                    "type": "mcq",
                    "question": "Which component in the MCP architecture is responsible for exposing local databases, file tools, or APIs?",
                    "options": ["The Client", "The Host", "The Server", "The Orchestrator"],
                    "answer": "The Server",
                    "explanation": "MCP Servers are lightweight services that expose tools, resources, and prompt templates to client applications."
                },
                {
                    "id": 3,
                    "type": "mcq",
                    "question": "What is the primary difference between a traditional LLM script and an Agent?",
                    "options": ["Agents are written in Javascript instead of Python.", "Agents execute in autonomous loops (Planning, Tool execution, and Error reflection) to achieve goals.", "Agents do not require API keys.", "Agents are faster but less accurate."],
                    "answer": "Agents execute in autonomous loops (Planning, Tool execution, and Error reflection) to achieve goals.",
                    "explanation": "Agents possess the capability to decide which actions (tools) to call, examine the outputs, adjust their plans dynamically, and loop until a desired condition is satisfied."
                },
                {
                    "id": 4,
                    "type": "mcq",
                    "question": "How does Gemini indicate that it needs to call an external function to answer a query?",
                    "options": ["By throwing an API Error.", "By returning a specific 'function_calls' metadata block in its response.", "By printing a system log.", "By calling the Python function directly in the background."],
                    "answer": "By returning a specific 'function_calls' metadata block in its response.",
                    "explanation": "When tool-calling is configured, the model returns a response requesting a function call, outputting the name and parameters, leaving execution to the client program."
                },
                {
                    "id": 5,
                    "type": "mcq",
                    "question": "What is the primary benefit of Agentic RAG compared to Naive RAG?",
                    "options": ["It uses fewer tokens.", "It retrieves everything in a single database lookup.", "It evaluates and self-corrects retrieval relevance, rewriting queries or searching web fallbacks if needed.", "It does not require text embeddings."],
                    "answer": "It evaluates and self-corrects retrieval relevance, rewriting queries or searching web fallbacks if needed.",
                    "explanation": "Agentic RAG integrates validation steps: evaluating retrieved results, regenerating queries, or executing web queries if local indices are insufficient."
                }
            ]
        },
        "project": {
            "id": "day3_project",
            "title": "Student Academic Advisor",
            "problem": "Students need tailored suggestions on course pathways, credit transfers, career goals, and workload management. You need to build a comprehensive 'Student Academic Advisor Agent' using LangGraph, incorporating ChromaDB RAG (retrieving academic handbook regulations) and a Gemini Planner. The system must create an interactive dashboard showing student study plans and offering autonomous advising logs.",
            "architecture": "User Question -> Router Node -> Query ChromaDB (Regs) -> LLM Planner (Evaluate degree pathway) -> Formulate Advising response -> Output structured report.",
            "workflow": "1. Student enters current credits and career interest.\n2. LangGraph state initializes.\n3. Retriever checks handbook policies.\n4. Planner schedules recommended courses.\n5. Reflector validates course workload balance.\n6. UI displays the timeline.",
            "folder_structure": "student_advisor/\n├── graph.py\n├── db.py\n├── app.py\n├── data/\n│   └── courses.json\n└── requirements.txt",
            "steps": "1. Create graph.py containing state schema and nodes (Classify, QueryDB, Schedule, WorkloadCheck).\n2. Set up DB helper connecting to ChromaDB containing syllabus data.\n3. Implement workload threshold calculation in WorkloadCheck node.\n4. Design Streamlit app displaying advising logs side-by-side with recommended semester plans.",
            "code": """
# Conceptual structure of LangGraph Student Advisor Node
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END

class AdvisorState(TypedDict):
    student_profile: dict
    career_goal: str
    credits_completed: int
    recommended_courses: List[str]
    workload_score: float  # 0 to 10
    advising_log: str
    replan_count: int

def planner_node(state: AdvisorState):
    # Analyze student profile and suggest courses matching career goals
    # calls Gemini API
    suggested = ["CS-401 (AI Systems)", "CS-402 (NLP)", "CS-405 (Agentic Workflows)"]
    return {
        "recommended_courses": suggested, 
        "advising_log": "Generated initial academic roadmap."
    }

def workload_check_node(state: AdvisorState):
    # Calculate difficulty score
    # CS-401 (3.0), CS-402 (3.0), CS-405 (4.0) = 10.0 (Too high!)
    score = 10.0
    return {"workload_score": score}

def route_workload(state: AdvisorState):
    if state["workload_score"] > 8.0 and state["replan_count"] < 2:
        # Workload too high! Route back to planner to substitute a course
        return "replan"
    return "approve"

# Compile and define state flowchart
workflow = StateGraph(AdvisorState)
workflow.add_node("plan", planner_node)
workflow.add_node("check", workload_check_node)

workflow.add_edge(START, "plan")
workflow.add_edge("plan", "check")
workflow.add_conditional_edges(
    "check",
    route_workload,
    {
        "replan": "plan",
        "approve": END
    }
)
app = workflow.compile()
""",
            "explanation": "This LangGraph setup creates a feedback loop: a planner suggests course schedules, a validation node scores the course difficulty workload, and a router conditional edge routes the state back to the planner if workload scores exceed recommendations, ensuring students receive balanced recommendations."
        }
    }
}

WORKSHOP_CONTENT["day4"] = {
    "title": "Capstone Assignments & Projects",
    "modules": [
        {
            "id": "day4_mod1",
            "title": "Assignment Problem Statements",
            "topics": [
                {
                    "id": "capstone_problem_statements",
                    "title": "Domain-Specific Agentic Projects",
                    "content": """
### Overview
For your final assignment, you must select one of the following domain-specific Agentic AI problem statements to solve using the skills learned in the workshop (Gemini, LangChain, RAG, CrewAI, and MCP).

### Assignment Problem Statements

| Domain                  | Project Title                               | Problem Solved                                     | Core Features (2–3)                                                                                                      |
| ----------------------- | ------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Education**           | **Agentic AI Learning Gap Investigator**    | Teachers don't know *why* students struggle.       | 1. Analyze quiz results.<br>2. Identify concept-wise learning gaps.<br>3. Generate personalized remedial plans.          |
| **Education**           | **Agentic AI Lab Experiment Evaluator**     | Manual lab assessment is time-consuming.           | 1. Observe experiment execution via video.<br>2. Detect incorrect procedural steps.<br>3. Generate improvement feedback. |
| **Healthcare**          | **Agentic AI Medication Adherence Coach**   | Patients often miss medications.                   | 1. Verify medicine intake using image recognition.<br>2. Detect missed doses.<br>3. Create adaptive reminder schedules.  |
| **Agriculture**         | **Agentic AI Irrigation Planner**           | Water is wasted due to fixed irrigation schedules. | 1. Monitor soil moisture.<br>2. Predict irrigation needs.<br>3. Recommend watering schedules.                            |
| **Agriculture**         | **Agentic AI Pest Outbreak Predictor**      | Farmers react after pests spread.                  | 1. Detect early pest indicators.<br>2. Predict outbreak risk.<br>3. Recommend preventive measures.                       |
| **Retail**              | **Agentic AI Dynamic Price Advisor**        | Static pricing reduces competitiveness.            | 1. Analyze demand trends.<br>2. Monitor inventory levels.<br>3. Suggest optimal pricing.                                 |
| **Manufacturing**       | **Agentic AI Root Cause Investigator**      | Finding causes of defects is slow.                 | 1. Detect product defects.<br>2. Analyze production logs.<br>3. Recommend likely root causes.                            |
| **Smart Cities**        | **Agentic AI Streetlight Optimizer**        | Streetlights remain on unnecessarily.              | 1. Detect pedestrian/vehicle activity.<br>2. Predict usage patterns.<br>3. Recommend lighting schedules.                 |
| **Environment**         | **Agentic AI River Pollution Investigator** | Pollution sources are difficult to trace.          | 1. Analyze water quality data.<br>2. Identify likely pollution sources.<br>3. Generate intervention reports.             |
| **Corporate**           | **Agentic AI Meeting Health Analyzer**      | Meetings are often unproductive.                   | 1. Measure speaking balance.<br>2. Detect engagement trends.<br>3. Generate productivity recommendations.                |
| **Cybersecurity**       | **Agentic AI Insider Threat Investigator**  | Internal threats are hard to identify.             | 1. Detect unusual user activity.<br>2. Correlate access patterns.<br>3. Recommend security actions.                      |
| **Energy**              | **Agentic AI Building Energy Optimizer**    | Buildings consume excess energy.                   | 1. Monitor occupancy.<br>2. Predict energy demand.<br>3. Recommend HVAC and lighting adjustments.                        |
| **Sports**              | **Agentic AI Cricket Strategy Assistant**   | Coaches need quick tactical insights.              | 1. Analyze player positioning.<br>2. Detect tactical weaknesses.<br>3. Recommend field placements.                       |
| **Tourism**             | **Agentic AI Crowd Experience Manager**     | Tourist attractions become overcrowded.            | 1. Monitor crowd density.<br>2. Predict congestion.<br>3. Recommend alternate routes.                                    |
| **Disaster Management** | **Agentic AI Emergency Resource Planner**   | Emergency resources are allocated inefficiently.   | 1. Assess incident severity.<br>2. Prioritize response.<br>3. Recommend deployment of available resources.               |

### Requirements
- **Architecture**: Design a multi-agent system or RAG pipeline.
- **Tools**: Integrate at least one external tool or MCP server.
- **UI**: Provide a basic Streamlit interface for user interaction.
"""
                }
            ]
        }
    ],
    "quiz": {
        "id": "day4_quiz",
        "title": "Capstone Self-Assessment",
        "questions": []
    },
    "project": {
        "id": "day4_project",
        "title": "Select and Execute a Capstone",
        "problem": "Select one of the domain-specific projects listed in the assignment table and implement a working prototype.",
        "architecture": "Custom depending on the chosen project.",
        "workflow": "1. Understand the problem.\\n2. Design the agentic architecture.\\n3. Build and test.\\n4. Submit the repository.",
        "folder_structure": "capstone_project/\\n├── app.py\\n├── agents.py\\n├── requirements.txt\\n└── README.md",
        "steps": "Review the domain problem statements, select one that matches your interest, and build a full-stack Streamlit application.",
        "code": "# Your implementation goes here",
        "explanation": "This capstone is entirely self-driven to test your end-to-end understanding of Agentic AI."
    }
}
