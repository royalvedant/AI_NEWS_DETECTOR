import google.generativeai as genai
import os
import time
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

MODELS = [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-pro"
]

def generate_ai(prompt: str) -> str:
    """ Generates content using a fallback system of Gemini models. """
    if not api_key:
        # Fallback to mock for local testing without key
        return f"AI Response (Simulated): Based on the context, the primary impact is... [Prompt Sample: {prompt[:50]}...]"

    for model_name in MODELS:
        try:
            print(f"Attempting with {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Model {model_name} failed: {e}")
            time.sleep(1) # Brief delay before fallback
            
    return "AI service temporarily unavailable. Please check your API key and connection."
