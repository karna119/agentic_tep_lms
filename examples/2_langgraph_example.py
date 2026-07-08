# 2_langgraph_example.py
from typing import TypedDict, Literal
from langgraph.graph import StateGraph, START, END

"""
# LangGraph Example
LangGraph is built on top of LangChain to create stateful, multi-actor, and cyclic workflows (like Agents).
Instead of a simple straight-line pipeline, LangGraph lets you build a directed graph where state is passed between nodes,
and conditional edges decide what to do next based on the state.

This script demonstrates a basic Router Graph without hitting a live LLM, purely to show graph mechanics.
"""

# 1. Define the State
# The State is a dictionary that is passed between nodes. Each node can update it.
class GraphState(TypedDict):
    query: str
    intent: str
    response: str

# 2. Define the Nodes
# Nodes are Python functions that receive the state, perform logic, and return updates to the state.
def classify_intent_node(state: GraphState):
    print(f"[Node: Classify] Analyzing query: '{state['query']}'")
    query = state["query"].lower()
    
    if "refund" in query or "money" in query:
        return {"intent": "billing"}
    else:
        return {"intent": "general"}

def billing_node(state: GraphState):
    print("[Node: Billing] Handling billing request...")
    return {"response": "I see you have a question about billing. I'll connect you to finance."}

def general_node(state: GraphState):
    print("[Node: General] Handling general request...")
    return {"response": "How can I help you with our platform today?"}

# 3. Define the Conditional Router
def route_based_on_intent(state: GraphState) -> Literal["billing", "general"]:
    print(f"[Router] Routing to -> {state['intent']}")
    return state["intent"]

def run_langgraph_example():
    # 4. Build the Graph
    workflow = StateGraph(GraphState)
    
    # Add nodes to the graph
    workflow.add_node("classify", classify_intent_node)
    workflow.add_node("billing", billing_node)
    workflow.add_node("general", general_node)
    
    # Define edges (the flow)
    workflow.add_edge(START, "classify")
    
    # Conditional edge branches off based on the router function
    workflow.add_conditional_edges(
        "classify", 
        route_based_on_intent,
        {
            "billing": "billing",
            "general": "general"
        }
    )
    
    workflow.add_edge("billing", END)
    workflow.add_edge("general", END)
    
    # Compile it into a runnable app
    app = workflow.compile()
    
    print("--- Test 1 ---")
    result1 = app.invoke({"query": "I want a refund for my last invoice."})
    print(f"Final Response: {result1['response']}\n")

    print("--- Test 2 ---")
    result2 = app.invoke({"query": "How do I change my profile picture?"})
    print(f"Final Response: {result2['response']}\n")

if __name__ == "__main__":
    run_langgraph_example()
