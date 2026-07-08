# 5_agentic_rag_example.py
from typing import TypedDict, List
from langgraph.graph import StateGraph, START, END

"""
# Agentic RAG Example
Standard RAG passively retrieves documents and generates an answer. 
Agentic RAG uses an Agent (via LangGraph) to actively evaluate the retrieved documents. 
If the documents aren't relevant, the agent can decide to rewrite the query or look elsewhere!

In this simulation, the Agent evaluates if the document actually answers the question.
If not, it triggers a 'fallback' action.
"""

class AgenticRagState(TypedDict):
    question: str
    documents: List[str]
    is_relevant: bool
    final_answer: str

def retrieve_node(state: AgenticRagState):
    print(f"[Retriever] Searching for: '{state['question']}'")
    # Simulated database lookup
    db = {
        "apples": "Apples are a type of fruit that grow on trees.",
    }
    
    docs = []
    for key, val in db.items():
        if key in state["question"].lower():
            docs.append(val)
            
    return {"documents": docs}

def evaluate_node(state: AgenticRagState):
    # The agent uses reasoning to see if the docs are useful
    print("[Evaluator] Checking if retrieved documents are relevant...")
    docs = state["documents"]
    
    if len(docs) == 0:
        print("[Evaluator] No documents found! Not relevant.")
        return {"is_relevant": False}
    
    print(f"[Evaluator] Found docs: '{docs[0]}'. Marked as relevant.")
    return {"is_relevant": True}

def generate_node(state: AgenticRagState):
    print("[Generator] Generating final answer using context...")
    context = state["documents"][0]
    answer = f"Based on the context ('{context}'), I have answered your question."
    return {"final_answer": answer}

def fallback_node(state: AgenticRagState):
    print("[Fallback] Documents weren't relevant. Triggering web search fallback (simulated)...")
    return {"final_answer": "I couldn't find the answer in our local database, so I searched the web."}

def route_evaluation(state: AgenticRagState):
    if state["is_relevant"]:
        return "generate"
    return "fallback"

def run_agentic_rag():
    workflow = StateGraph(AgenticRagState)
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("evaluate", evaluate_node)
    workflow.add_node("generate", generate_node)
    workflow.add_node("fallback", fallback_node)
    
    workflow.add_edge(START, "retrieve")
    workflow.add_edge("retrieve", "evaluate")
    
    workflow.add_conditional_edges(
        "evaluate",
        route_evaluation,
        {
            "generate": "generate",
            "fallback": "fallback"
        }
    )
    workflow.add_edge("generate", END)
    workflow.add_edge("fallback", END)
    
    app = workflow.compile()
    
    print("--- Scenario 1: Good Query (Agent finds relevant docs) ---")
    result = app.invoke({"question": "Tell me about apples."})
    print(f"Result: {result['final_answer']}\n")
    
    print("--- Scenario 2: Bad Query (Agent falls back when docs fail) ---")
    result = app.invoke({"question": "Tell me about spaceships."})
    print(f"Result: {result['final_answer']}\n")

if __name__ == "__main__":
    run_agentic_rag()
