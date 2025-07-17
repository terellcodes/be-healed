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

load_dotenv(os.path.join(os.path.dirname(__file__), "./.env"))

# use context from previous parts of agent to achieve it's task
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

def should_continue(state):
    last_message = state["messages"][-1]

    if last_message.tool_calls:
        return "action"

    return END

def get_research_graph():
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
        return {"messages" : [response]}

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