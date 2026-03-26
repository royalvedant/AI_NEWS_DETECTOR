# AI Newsroom: AI-Native Business Intelligence Platform

AI Newsroom is a futuristic business news platform prototype (inspired by Bloomberg/Economic Times) that demonstrates how AI transforms news consumption from passive reading into interactive intelligence.

## 🚀 Features

1.  **My ET (Personalized Newsroom):** AI-curated dashboard based on your industry interests and followed companies.
2.  **News Navigator (AI Briefings):** Deep synthesized reports instead of simple articles, featuring automated summaries, impact analysis, and expert opinion simulations.
3.  **RAG Chatbot:** Ask questions about any article (e.g., "How does this affect investors?") using a simulated RAG (Retrieval-Augmented Generation) pipeline.
4.  **Story Arc Tracker:** Interactive timeline visualizations showing the evolution of major news stories, sentiment flow, and stock price correlation.
5.  **AI Video Studio:** Convert any article into a 60-second video report with a simulated generation pipeline (Script -> Audio -> Slides -> Render).
6.  **Vernacular Engine:** Instant translation of complex business news into Indian languages (Hindi, Tamil, etc.).

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI, Framer Motion, Recharts.
*   **Backend:** Node.js, Express, TypeScript.
*   **AI Simulation:** Mocked LangChain/OpenAI services to allow immediate local testing without API keys.

## 🏁 Getting Started

### 1. Prerequisites
*   Node.js 18+
*   npm

### 2. Installation
From the root directory:
```bash
npm run install:all
```

### 3. Run Development Servers
Start both the Frontend and Backend concurrently:
```bash
npm run dev
```

The apps will be available at:
*   **Frontend:** [http://localhost:3000](http://localhost:3000)
*   **Backend:** [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

*   `/frontend`: Next.js web application.
*   `/backend`: Express API handling news data and AI logic.
*   `package.json`: Root manager for concurrent execution.

## 🧪 AI Integration
This prototype uses a **Mock AI Service Layer** in `backend/services/ai-service.ts`. This allows you to explore the full UX immediately. To connect to real models:
1.  Update `backend/services/ai-service.ts` to call OpenAI/Gemini APIs.
2.  Provide your API keys in the `.env` file.
