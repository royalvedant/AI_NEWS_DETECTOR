const { mockArticles } = require('../data/mock-articles');

class AIService {
  static async generateBriefing(article) {
    // Simulated AI Processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      overview: `AI Summary: ${article.summary}`,
      keyFacts: [
        "Major impact on the technology sector.",
        "Increased market volatility observed.",
        "Strategic shift in regional logistics."
      ],
      impactAnalysis: "The primary impact is a shift towards automated infrastructure...",
      expertOpinions: [
        "Industry Leader: 'A game charger for our Q4 strategy.'",
        "Economic Analyst: 'We expect a ripple effect across all indices.'"
      ]
    };
  }

  static async generateVideoScript(article) {
    return {
       totalDuration: 60,
       scenes: [
          { id: 1, duration: 20, narration: `Breaking News: ${article.headline}`, visual: "dynamic ticker" }
       ]
    };
  }
}

module.exports = { AIService };
