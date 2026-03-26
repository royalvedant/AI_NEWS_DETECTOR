interface Article {
  id: string;
  headline: string;
  content: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  industry: string;
  companies: string[];
  readTimeMin: number;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

const mockArticles: Article[] = [
  {
    id: "art_101",
    headline: "Google vs OpenAI: The Race for AGI Heats Up",
    content: "In a stunning turn of events, Google has announced a new foundational model that purportedly rivals OpenAI's latest GPT iteration...",
    summary: "Google announces a new AI model to compete directly with OpenAI's latest offerings, intensifying the race for Artificial General Intelligence.",
    sentiment: "neutral",
    industry: "Technology",
    companies: ["Google", "OpenAI"],
    readTimeMin: 4,
    imageUrl: "https://images.unsplash.com/photo-1620825937374-87fc1d6aafdd?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    source: "Ai Tech Crunch"
  },
  {
    id: "art_102",
    headline: "Federal Reserve Hints at Rate Cuts by Q3",
    content: "The Federal Reserve indicated today that if inflation continues to cool, it may consider reducing interest rates as early as the third quarter...",
    summary: "The Fed suggests potential interest rate cuts by Q3 if inflation trends downward, boosting market optimism.",
    sentiment: "positive",
    industry: "Markets",
    companies: ["Federal Reserve"],
    readTimeMin: 3,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source: "Economic Times"
  }
];

// Use CommonJS export to avoid verbatimModuleSyntax ESM errors in CommonJS environments
module.exports = { mockArticles };
