# 3_mcp_example.py
from mcp.server.fastmcp import FastMCP

"""
# Model Context Protocol (MCP) Example
MCP is an open standard that allows AI models to securely connect to local tools, data sources, and APIs.
It standardizes how an AI 'Client' talks to a tool 'Server'. 

This script demonstrates creating a simple FastMCP Server that exposes a few basic tools.
An MCP Client (like Claude Desktop or a custom LangChain app) can connect to this server and use these tools natively.

To test this locally without an LLM client, use the MCP Inspector:
`npx @modelcontextprotocol/inspector uv run 3_mcp_example.py`
"""

# Create a FastMCP Server named "Utilities Server"
mcp = FastMCP("Utilities Server")

# 1. Expose a simple Calculator tool
@mcp.tool()
def calculate_sum(a: float, b: float) -> float:
    """Add two numbers together. Use this when the user needs to add quantities."""
    return a + b

# 2. Expose a system-level tool (simulated)
@mcp.tool()
def get_user_greeting(name: str) -> str:
    """Generates a personalized greeting based on the time of day (simulated)."""
    return f"Hello, {name}! Welcome to the Model Context Protocol."

# 3. Expose a Resource (Read-only data the LLM can access)
@mcp.resource("config://app/settings")
def get_settings() -> str:
    """Get the current application settings."""
    return '{"theme": "dark", "version": "1.0.4", "debug_mode": true}'

if __name__ == "__main__":
    print("Starting MCP Server. Note: This is designed to be run by an MCP Client.")
    print("Run this using an MCP Inspector to test the protocol communication.")
    # This binds the server to stdio streams so the client can talk to it.
    mcp.run()
