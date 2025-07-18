from tools import retrieve
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.tools.arxiv.tool import ArxivQueryRun
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import ToolNode
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages
import operator
from langchain_core.messages import BaseMessage
from langchain_core.tools import Tool
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv
import os
from uuid import uuid4
from langsmith import Client

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "./.env"))

# Debug print
print("LANGCHAIN_API_KEY:", bool(os.getenv("LANGCHAIN_API_KEY")))  # Don't print the actual key
print("LANGCHAIN_TRACING_V2:", os.getenv("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_ENDPOINT:", os.getenv("LANGCHAIN_ENDPOINT"))
print("LANGCHAIN_PROJECT:", os.getenv("LANGCHAIN_PROJECT"))

# Initialize LangSmith client
client = Client()

# use context from previous parts of agent to achieve it's task
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

def should_continue(state):
    last_message = state["messages"][-1]

    if last_message.tool_calls:
        return "action"

    return END

system_prompt = """
You are a helpful researcher that can answer questions to help explain and provide solutions to problems related to pain in the body.

You answer questions with great detail and accuracy.

You have access to the following tools:
1. `Tight Hip, Twisted Core` book by Christine Koth
2. Tavily Search: To search the web for broad information that supports contents found in the book `Tight Hip, Twisted Core` by Christine Koth
3. Arxiv Query Run: To search the web for broad information that supports contents found in the book `Tight Hip, Twisted Core` by Christine Koth

Bias towards using these tools rather than using your own knowledge. Use at least 2 tools to answer each question.
You are a crafty researcher which makes additional effort to use all the tools available to you.
In your response, provide a solution that encourages the user to take action.
In your response, be generous with white space especially after a section of text.
"""

def get_research_graph():
    # Set unique run ID for tracing
    os.environ["LANGCHAIN_PROJECT"] = f"be-healed-{uuid4().hex[:8]}"
    
    tavily_tool = TavilySearchResults(max_results=5)
    tool_belt = [
        tavily_tool,
        ArxivQueryRun(),
        Tool.from_function(
            func=retrieve,
            name="Retrieve",
            description="provides detailed information about the book `Tight Hip, Twisted Core` by Christine Koth, which focuses on understanding, diagnosing, treating, and preventing issues related to tight hip flexors, particularly the iliacus muscle, and their widespread impact on the body. It can help agents answer queries about the causes and effects of iliopsoas tightness throughout the body, as well as solutions for relief and prevention, including self-treatment and professional interventions")
    ]

    model = ChatOpenAI(model="gpt-4.1-nano", temperature=0)
    model = model.bind_tools(tool_belt)

    # we call the tool with the payload provided by the model
    tool_node = ToolNode(tool_belt)

    uncompiled_graph = StateGraph(AgentState)

    def call_model(state):
        messages = state["messages"]
        response = model.invoke(messages)
        return {"messages": [response]}

    # uncompiled_graph.add_node("planner", planner_node)
    uncompiled_graph.add_node("agent", call_model)
    uncompiled_graph.add_node("action", tool_node)
    uncompiled_graph.set_entry_point("agent")

    uncompiled_graph.add_conditional_edges(
        "agent",
        should_continue
    )

    uncompiled_graph.add_edge("action", "agent")
    research_agent_graph = uncompiled_graph.compile()
    return research_agent_graph



if __name__ == "__main__":
    pass