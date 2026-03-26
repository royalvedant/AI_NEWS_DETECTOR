"use client";

import { useEffect, useState, useCallback } from "react";
import ArticleCard from "@/components/ArticleCard";
import { Sparkles, TrendingUp, Cpu, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const availableInterests = ["Technology", "Markets", "Automotive", "Semiconductors", "Startups", "Crypto"];

  const fetchPersonalizedFeed = useCallback(async (interests: string[]) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/personalized", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedInterests = localStorage.getItem("newsroom_interests");
    if (!savedInterests) {
      setShowOnboarding(true);
    } else {
      const parsed = JSON.parse(savedInterests);
      setSelectedInterests(parsed);
      fetchPersonalizedFeed(parsed);
    }
  }, [fetchPersonalizedFeed]);

  const saveInterests = () => {
    localStorage.setItem("newsroom_interests", JSON.stringify(selectedInterests));
    setShowOnboarding(false);
    fetchPersonalizedFeed(selectedInterests);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My ET</h1>
        </div>
        <p className="text-zinc-400">
          Your personalized, AI-curated intelligence briefing.
        </p>
      </section>

      {/* Main Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-200">Top Stories For You</h2>
          <div className="flex gap-2">
            {selectedInterests.map(interest => (
              <Badge key={interest} variant="outline" className="text-zinc-400 border-zinc-800">
                {interest}
              </Badge>
            ))}
            <Button variant="link" className="text-indigo-400 h-auto p-0" onClick={() => setShowOnboarding(true)}>
              Edit Interests
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[400px] rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Row Preview */}
      <section className="pt-8 border-t border-zinc-800/50">
        <h2 className="text-xl font-semibold text-zinc-200 mb-6">Explore Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
            <TrendingUp className="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-zinc-200">Markets</h3>
            <p className="text-sm text-zinc-500 mt-1">Live updates on global indices</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
            <Cpu className="w-6 h-6 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-zinc-200">Technology</h3>
            <p className="text-sm text-zinc-500 mt-1">AI, Startups, and Silicon Valley</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
            <Briefcase className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-zinc-200">Business</h3>
            <p className="text-sm text-zinc-500 mt-1">Acquisitions and corporate law</p>
          </div>
        </div>
      </section>

      {/* Onboarding Modal */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="text-indigo-500 w-5 h-5"/> Personalize Your Feed
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Select the industries you want to follow. Our AI will curate your daily briefing based on these preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-4">
            {availableInterests.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 text-sm transition-all duration-300 ${
                  selectedInterests.includes(interest) 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent" 
                    : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500"
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button 
              onClick={saveInterests}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Start Reading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
