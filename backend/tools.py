# Load and query vector store
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Qdrant
from dotenv import load_dotenv
import os
from langchain_core.tools import tool
from typing import Annotated, List, Tuple, Union
from qdrant_client import QdrantClient

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "./.env"))


# Initialize the embedding model (must be the same as used for creation)
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

# Initialize Qdrant client with local storage
client = QdrantClient(path="vector_db")  # Use path for local storage

# Load the existing vector store
vector_store = Qdrant(
    client=client,  # Use the client instead of path
    collection_name="thtc_collection",
    embeddings=embedding_model,
)

qdrant_retriever = vector_store.as_retriever()


@tool
def retrieve(
    query: Annotated[str, "query about information in the tight hips, twisted core book"]
    ):
  """provides detailed information about the book "Tight Hip, Twisted Core" by Christine Koth, which focuses on understanding, diagnosing, treating, and preventing issues related to tight hip flexors, particularly the iliacus muscle, and their widespread impact on the body. It can help agents answer queries about the causes and effects of iliopsoas tightness throughout the body, as well as solutions for relief and prevention, including self-treatment and professional interventions"""
  retrieved_docs = qdrant_retriever.invoke(query)
  return {"context" : retrieved_docs}




