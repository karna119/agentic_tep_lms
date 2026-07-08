# 1_langchain_example.py
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

"""
# LangChain Example
LangChain is a framework that makes it easy to build LLM applications by chaining together
prompts, models, and output parsers using a clean, declarative syntax known as LangChain Expression Language (LCEL).

This script demonstrates a basic chain:
Prompt -> LLM -> String Output Parser
"""

def run_langchain_example():
    # 1. Initialize the LLM (ensure GEMINI_API_KEY is set in your environment)
    print("Initializing LLM...")
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.3
    )

    # 2. Design Prompt Template
    prompt = ChatPromptTemplate.from_template(
        "You are an expert tech teacher. Explain the concept of {concept} in two simple sentences."
    )

    # 3. Create the Chain using LCEL (the pipe operator '|')
    # The output of the prompt goes into the LLM, and the LLM's raw response goes into the parser
    chain = prompt | llm | StrOutputParser()

    # 4. Invoke the chain with dynamic variables
    concept_to_learn = "Prompt Engineering"
    print(f"Asking about: {concept_to_learn}")
    
    result = chain.invoke({"concept": concept_to_learn})
    
    print("\n--- Result ---")
    print(result)

if __name__ == "__main__":
    run_langchain_example()
