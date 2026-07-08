# Agentic & RAG Examples

This folder contains standalone, runnable examples of modern AI engineering techniques and frameworks. Each script focuses on a single concept, with heavy comments explaining the mechanisms at work.

## Prerequisites
To run these examples, you will need a Python environment with the required libraries installed.

```bash
pip install langchain langchain-google-genai langgraph chromadb mcp google-genai
```

You will also need to export your Gemini API key:
```bash
# On Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# On Mac/Linux
export GEMINI_API_KEY="your-api-key-here"
```

## The Examples

1. **`1_langchain_example.py`**
   Demonstrates LCEL (LangChain Expression Language) building a declarative pipeline mapping a Prompt -> LLM -> Output Parser.

2. **`2_langgraph_example.py`**
   Demonstrates how to build stateful AI workflows. It creates a simple graph where a "Router" node evaluates the state and directs the flow to different handling nodes conditionally.

3. **`3_mcp_example.py`**
   Demonstrates the **Model Context Protocol (MCP)** by creating a lightweight `FastMCP` server. This server exposes Python functions as generic tools that any MCP-compatible AI client can discover and use securely.

4. **`4_rag_example.py`**
   A complete, minimalistic Retrieval-Augmented Generation (RAG) pipeline. It embeds sample documents into an in-memory ChromaDB vector store, queries them based on user input, and uses the retrieved text as context for a Gemini prompt.

5. **`5_agentic_rag_example.py`**
   Takes RAG a step further into Agentic workflows. Instead of blindly trusting the retrieved documents, the agent evaluates the documents for relevance. If relevant, it generates an answer. If irrelevant, it branches off to a fallback tool (like a web search).
