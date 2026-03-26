from vector_store import search_docs
from ai_router import generate_ai

def rag_query(question: str) -> str:
    """ Performs a Retrieval-Augmented Generation query. """
    docs = search_docs(question)
    
    if not docs:
        # If no documents indexed, use the AI router directly
        return generate_ai(f"Standard AI Response to: {question}")
    
    context = ""
    for doc in docs:
        context += doc.page_content + "\n---\n"
        
    prompt = f"""
    You are an AI Business Analyst. Answer the question precisely using the provided context.
    If the answer isn't in the context, say you don't know based on the provided documents.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    
    return generate_ai(prompt)
