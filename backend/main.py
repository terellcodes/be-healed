from research_graph import get_research_graph, system_prompt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List, Dict, Optional
from dotenv import load_dotenv
import os
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel

# env_path = os.path.join(os.path.dirname(__file__), "./.env")
# load_dotenv(env_path)

# Global variable to store the research graph
research_graph = None

class QueryRequest(BaseModel):
    query: str
    openaiApiKey: Optional[str] = None
    tavilyApiKey: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    context: Dict = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    global research_graph
    try:
        research_graph = get_research_graph()
        print("Research graph initialized successfully")
    except Exception as e:
        print(f"Error initializing research graph: {e}")
        research_graph = None
    yield
    # Shutdown
    print("Shutting down...")
    research_graph = None

app = FastAPI(
    title="Be Healed API",
    description="Backend API for Be Healed application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
origins = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
async def root():
    return {"message": "Welcome to Be Healed API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    
    # Set API keys if provided
    if request.openaiApiKey:
        os.environ["OPENAI_API_KEY"] = request.openaiApiKey
    if request.tavilyApiKey:
        os.environ["TAVILY_API_KEY"] = request.tavilyApiKey
    
    try:
        print(f"Processing query: {request.query}")
        messages = []
        messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=request.query))
        
        inputs = {"messages": messages}
        
        if not research_graph:
            print("Research graph not initialized")
            raise HTTPException(status_code=503, detail="Research graph not initialized")
        
        response = await research_graph.ainvoke(inputs)
        
        final_message = response["messages"][-1]
        
        result = QueryResponse(
            answer=final_message.content if hasattr(final_message, "content") else str(final_message),
            context=final_message.additional_kwargs if hasattr(final_message, "additional_kwargs") else None
        )
        return result
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")
