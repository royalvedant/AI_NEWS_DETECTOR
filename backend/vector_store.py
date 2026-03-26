from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from typing import List

# Initialize local embeddings (runs locally, no API key needed)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

vector_db = None

def create_vector_store(docs):
    """ Creates a FAISS vector store from a list of LangChain documents. """
    global vector_db
    if not docs:
        print("No documents provided to index.")
        return
    vector_db = FAISS.from_documents(docs, embeddings)
    print("Vector store created and indexed.")

def search_docs(query: str, k: int = 3):
    """ Searches for relevant document chunks based on semantic similarity. """
    if vector_db is None:
        print("Vector store not initialized.")
        return []
    return vector_db.similarity_search(query, k=k)
