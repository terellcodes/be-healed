from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import PyMuPDFLoader
import tiktoken
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Qdrant
from dotenv import load_dotenv
import os

env_path = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv(env_path)

def generate_thtc_vector_store():
    # Create storage directory if it doesn't exist
    storage_path = "vector_db"
    os.makedirs(storage_path, exist_ok=True)

    path = "data/"
    loader = DirectoryLoader(path, glob="*.pdf", loader_cls=PyMuPDFLoader)
    docs = loader.load()

    def tiktoken_len(text):
        tokens = tiktoken.encoding_for_model("gpt-4o").encode(
            text,
        )
        return len(tokens)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 750,
        chunk_overlap = 0,
        length_function = tiktoken_len,
    )

    thtc_docs = text_splitter.split_documents(docs)

    embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

    # Use persistent storage instead of in-memory
    qdrant_vectorstore = Qdrant.from_documents(
        documents=thtc_docs,
        embedding=embedding_model,
        path=storage_path,  # Local path for persistent storage
        collection_name="thtc_collection"  # Name your collection
    )

    qdrant_retriever = qdrant_vectorstore.as_retriever()

    return qdrant_retriever

if __name__ == "__main__":
    print("Generating THTC vector store...")
    retriever = generate_thtc_vector_store()
    print("Vector store generated successfully!")
    print(f"Data is stored in the 'vector_db' directory")