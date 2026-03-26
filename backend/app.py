from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import json
from datetime import datetime, timedelta
from typing import List, Optional

# Import our AI modules
from ai_router import generate_ai
from rag_pipeline import rag_query
from file_loader import load_pdf
from vector_store import create_vector_store
from memory import save_message, get_history

app = FastAPI(title="AI Newsroom Backend")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data (Migrated from TypeScript)
MOCK_ARTICLES = [
    {
        "id": "art_101",
        "headline": "Google vs OpenAI: The Race for AGI Heats Up",
        "content": "In a stunning turn of events, Google has announced a new foundational model that purportedly rivals OpenAI's latest GPT iteration...",
        "summary": "Google announces a new AI model to compete directly with OpenAI's latest offerings, intensifying the race for Artificial General Intelligence.",
        "sentiment": "neutral",
        "industry": "Technology",
        "companies": ["Google", "OpenAI"],
        "readTimeMin": 4,
        "imageUrl": "https://images.unsplash.com/photo-1620825937374-87fc1d6aafdd?auto=format&fit=crop&q=80&w=800",
        "publishedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
        "source": "Ai Tech Crunch"
    },
    {
        "id": "art_102",
        "headline": "Federal Reserve Hints at Rate Cuts by Q3",
        "content": "The Federal Reserve indicated today that if inflation continues to cool, it may consider reducing interest rates as early as the third quarter...",
        "summary": "The Fed suggests potential interest rate cuts by Q3 if inflation trends downward, boosting market optimism.",
        "sentiment": "positive",
        "industry": "Markets",
        "companies": ["Federal Reserve"],
        "readTimeMin": 3,
        "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
        "publishedAt": (datetime.now() - timedelta(hours=5)).isoformat(),
        "source": "Economic Times"
    },
    {
        "id": "art_103",
        "headline": "Tesla Unveils Autonomous Robo-Taxi Prototype",
        "content": "Elon Musk revealed Tesla's long-awaited Robo-Taxi concept today, featuring a steering-wheel-less design and advanced FSD hardware.",
        "summary": "Tesla reveals its autonomous Robo-Taxi, removing traditional controls and pushing the boundaries of self-driving technology.",
        "sentiment": "positive",
        "industry": "Automotive",
        "companies": ["Tesla"],
        "readTimeMin": 5,
        "imageUrl": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
        "publishedAt": (datetime.now() - timedelta(hours=12)).isoformat(),
        "source": "Bloomberg"
    },
    {
        "id": "art_104",
        "headline": "Nvidia Valuation Surpasses Entire Energy Sector",
        "content": "Driven by insatiable demand for AI chips, Nvidia's market capitalization has now eclipsed the combined value of all S&P 500 energy companies...",
        "summary": "Nvidia's market cap now exceeds the entire S&P 500 energy sector due to exponential demand for AI hardware.",
        "sentiment": "positive",
        "industry": "Semiconductors",
        "companies": ["Nvidia"],
        "readTimeMin": 6,
        "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        "publishedAt": (datetime.now() - timedelta(days=1)).isoformat(),
        "source": "Reuters"
    },
    {
        "id": "art_105",
        "headline": "Global Supply Chain Disruptions Hit Apple's Q2 Targets",
        "content": "Unexpected delays in component manufacturing across Asia have forced Apple to revise its Q2 revenue targets downward by 4%.",
        "summary": "Supply chain issues in Asia cause Apple to lower its Q2 revenue expectations.",
        "sentiment": "negative",
        "industry": "Consumer Electronics",
        "companies": ["Apple"],
        "readTimeMin": 3,
        "imageUrl": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800",
        "publishedAt": (datetime.now() - timedelta(days=2)).isoformat(),
        "source": "Business Standard"
    }
]

# Base Routes
@app.get("/")
def home():
    return {"status": "success", "message": "AI Newsroom FastAPI Backend Running"}

# News Endpoints
@app.get("/api/news")
def get_news():
    return {"success": True, "data": MOCK_ARTICLES}

@app.get("/api/news/{id}")
def get_article(id: str):
    article = next((a for a in MOCK_ARTICLES if a["id"] == id), None)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"success": True, "data": article}

@app.post("/api/personalized")
def get_personalized(payload: dict = Body(...)):
    interests = payload.get("interests", [])
    if not interests:
        return {"success": True, "data": MOCK_ARTICLES}
    
    filtered = [
        a for a in MOCK_ARTICLES 
        if any(
            interest.lower() in str(a.get("industry", "")).lower() or 
            any(interest.lower() in str(t).lower() for t in a.get("companies", []))
            for interest in interests
        )
    ]
    return {"success": True, "data": filtered if filtered else MOCK_ARTICLES}

# AI Intelligence Briefing
@app.post("/api/briefing")
def get_briefing(payload: dict = Body(...)):
    article_id = payload.get("articleId")
    article = next((a for a in MOCK_ARTICLES if a["id"] == article_id), None)
    
    # Simulate complex AI generation
    prompt = f"Analyze the following business news and provide a briefing with 'Overview', 'Key Impact', and 'Future Outlook'.\n\nNews: {article['content'] if article else 'Multiple market trends showing shifting AI demand.'}"
    analysis = generate_ai(prompt)
    
    return {
        "success": True,
        "data": {
            "title": article["headline"] if article else "Market Intelligence Report",
            "overview": f"Synthetic Overview: {analysis[:200]}...",
            "impactAnalysis": "This news has a significant potential to shift market dynamics in the short term.",
            "sentimentScore": 0.85 if article and article["sentiment"] == "positive" else 0.45,
            "keyFacts": [
                "Strategic move in the AGI competition.",
                "Market sentiment remains cautiously optimistic.",
                "Primary impact expected in enterprise software sectors."
            ],
            "expertOpinions": [
                "Industry Analyst: This changes the timeline for AGI significantly.",
                "Venture Capitalist: We are seeing a massive shift in capital towards these models."
            ]
        }
    }

# RAG & Document Intelligence
@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = f"backend/data/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Process PDF and Index in FAISS
    docs = load_pdf(file_path)
    if docs:
        create_vector_store(docs)
        return {"success": True, "message": f"Document '{file.filename}' indexed successfully."}
    return {"success": False, "message": "Failed to index document."}

@app.post("/api/ask")
def ask_document(payload: dict = Body(...)):
    user_id = payload.get("userId", "anonymous")
    question = payload.get("question")
    
    save_message(user_id, "user", question)
    answer = rag_query(question)
    save_message(user_id, "bot", answer)
    
    return {"success": True, "data": {"answer": answer}}

@app.post("/api/chat")
def chat_ai(payload: dict = Body(...)):
    # Standard chat (without RAG if needed, or using general knowledge)
    user_id = payload.get("userId", "anonymous")
    message = payload.get("message")
    
    history = get_history(user_id)
    context = "\n".join([f"{m['role']}: {m['content']}" for m in history[-5:]])
    
    prompt = f"Previous conversation:\n{context}\n\nUser: {message}\nAI:"
    answer = generate_ai(prompt)
    
    save_message(user_id, "user", message)
    save_message(user_id, "bot", answer)
    
    return {"success": True, "data": {"answer": answer}}

# Video Studio Pipeline
@app.post("/api/video")
def generate_video_script(payload: dict = Body(...)):
    article_id = payload.get("articleId")
    article = next((a for a in MOCK_ARTICLES if a["id"] == article_id), None)
    
    # Simulate script generation
    return {
        "success": True,
        "data": {
            "totalDurationSeconds": 60,
            "scenes": [
                {"id": 1, "durationSeconds": 10, "narration": f"Welcome to today's breakdown of {article['headline'] if article else 'the markets'}.", "visual": "Headline ticker and stock chart overlay"},
                {"id": 2, "durationSeconds": 25, "narration": article['summary'] if article else "Markets are showing unprecedented volatility today.", "visual": "Dynamic infographics showing data trends"},
                {"id": 3, "durationSeconds": 25, "narration": "Stay tuned to AI Newsroom for more deep dives into the changing economy.", "visual": "Closing brand animation"}
            ]
        }
    }

# Translation
@app.post("/api/translate")
def translate_text(payload: dict = Body(...)):
    text = payload.get("text")
    target_lang = payload.get("targetLanguage", "Hindi")
    
    prompt = f"Translate the following business news content into {target_lang}. Keep technical terms in brackets if necessary.\n\nContent: {text}"
    translation = generate_ai(prompt)
    
    return {"success": True, "data": {"translatedText": translation}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
