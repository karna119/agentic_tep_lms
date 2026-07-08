# 4_rag_example.py
import chromadb
from google import genai
import os

"""
# Retrieval-Augmented Generation (RAG) Example
RAG is the process of fetching private or real-time data from a database and providing it 
to the LLM as context, so it can answer questions based on your specific documents rather than just its training data.

This example:
1. Embeds some sample documents.
2. Stores them in a local ChromaDB vector database.
3. Retrieves the most relevant document based on a query.
4. Uses Gemini to answer the query using ONLY the retrieved document.
"""

def run_rag_example():
    # 1. Setup Local Vector DB (Chroma)
    print("Initializing ChromaDB...")
    chroma_client = chromadb.Client() # In-memory for example purposes
    collection = chroma_client.get_or_create_collection(name="internal_kb")
    
    # 2. Ingestion: Add some sample knowledge base documents
    print("Ingesting documents into vector database...")
    documents = [
        "Company policy requires employees to take at least 15 days of PTO per year.",
        "The WiFi password for the guest network in the New York office is 'WelcomeNYC2026'.",
        "Expense reports for travel must be submitted within 30 days of the trip return date."
    ]
    ids = ["doc1", "doc2", "doc3"]
    
    # Chroma handles embedding automatically under the hood using a default model, 
    # but in production, you would embed these with Google GenAI embeddings.
    collection.add(documents=documents, ids=ids)
    
    # 3. Retrieval: Search for the answer
    user_query = "What is the guest wifi password for NY?"
    print(f"\nUser Query: {user_query}")
    print("Retrieving relevant context from database...")
    
    results = collection.query(
        query_texts=[user_query],
        n_results=1 # Just get the top 1 most relevant document
    )
    
    retrieved_context = results['documents'][0][0]
    print(f"Found Context: '{retrieved_context}'")
    
    # 4. Generation: Pass context to LLM
    print("Generating answer using Gemini...")
    client = genai.Client()
    
    prompt = f"""
    You are a helpful company assistant. Answer the user's question using ONLY the provided context.
    If the context does not contain the answer, say "I don't know".
    
    Context: {retrieved_context}
    
    Question: {user_query}
    """
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt
    )
    
    print(f"\nFinal AI Answer:\n{response.text}")

if __name__ == "__main__":
    run_rag_example()
