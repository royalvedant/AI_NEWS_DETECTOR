"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Sparkles, Languages, PlayCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [briefing, setBriefing] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/news/${id}`);
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
          fetchBriefing(data.data.id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [id]); // Fixed missing dependency by moving function inside or wrapping in useCallback

  const fetchBriefing = async (articleId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/briefing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });
      const data = await res.json();
      if (data.success) setBriefing(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const translateArticle = async (lang: string) => {
    if (!article) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`http://localhost:3001/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: article.content, targetLanguage: lang })
      });
      const data = await res.json();
      if (data.success) setTranslatedText(data.data.translatedText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!article) return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-1/4 bg-zinc-900 rounded" />
      <div className="h-64 bg-zinc-900 rounded-xl" />
      <div className="space-y-4 pt-8">
        {[1,2,3].map(i => <div key={i} className="h-4 bg-zinc-900 rounded" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to My ET
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/story/${article.id}`}>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400"/> Story Arc Tracker
            </Button>
          </Link>
          <Link href={`/studio/${article.id}`}>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 gap-2">
              <PlayCircle className="w-4 h-4 text-rose-400"/> AI Video Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">{article.industry}</Badge>
          <span className="text-zinc-500 text-sm flex items-center gap-1"><Clock className="w-4 h-4"/> {article.readTimeMin} min read</span>
          <span className="text-zinc-500 text-sm">• {new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 leading-tight">
          {article.headline}
        </h1>
        <div className="relative h-80 md:h-[400px] w-full rounded-2xl overflow-hidden border border-zinc-800">
          <img src={article.imageUrl} alt={article.headline} className="object-cover w-full h-full" />
        </div>
      </header>

      {/* Main Content vs Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Original Article & Translation */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-300">
              <Languages className="w-5 h-5 text-indigo-400" />
              <span className="font-medium">Vernacular Engine</span>
            </div>
            <div className="flex gap-2">
              {['Hindi', 'Tamil'].map(lang => (
                <Button 
                  key={lang} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => translateArticle(lang)}
                  disabled={isTranslating}
                  className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs"
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none">
            {translatedText ? (
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl border-l-4 border-l-indigo-500 text-lg text-zinc-300">
                {translatedText}
              </div>
            ) : null}
            <p className="text-xl leading-relaxed text-zinc-300">{article.content}</p>
            {/* Adding dummy content to represent a full article */}
            <p className="text-lg leading-relaxed text-zinc-400 mt-4">This development marks a significant turning point. Analysts have observed that strategic investments in this sector are yielding unprecedented returns. The coming weeks will be critical as regulatory frameworks try to catch up with the pace of innovation...</p>
          </div>
        </div>

        {/* Right: AI Intelligence Briefing */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-zinc-100">AI Intelligence Briefing</h2>
            </div>
            
            {!briefing ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-zinc-800" />
                <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                <Skeleton className="h-20 w-full bg-zinc-800 mt-6" />
                <p className="text-sm text-zinc-500 animate-pulse text-center mt-4">Generating synthetic report...</p>
              </div>
            ) : (
              <div className="space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold text-zinc-200 mb-2 uppercase tracking-wider text-xs">Overview</h3>
                  <p className="text-zinc-400">{briefing?.overview}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200 mb-2 uppercase tracking-wider text-xs">Key Facts</h3>
                  <ul className="list-disc pl-4 text-zinc-400 space-y-1">
                    {briefing?.keyFacts?.map((fact: string, i: number) => <li key={i}>{fact}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <h3 className="font-semibold text-indigo-300 mb-2 uppercase tracking-wider text-xs">Impact Analysis</h3>
                  <p className="text-indigo-200/80">{briefing?.impactAnalysis}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200 mb-2 uppercase tracking-wider text-xs">Expert Opinions</h3>
                  <div className="space-y-2">
                    {briefing?.expertOpinions?.map((op: string, i: number) => (
                      <blockquote key={i} className="pl-3 border-l-2 border-zinc-700 text-zinc-400 italic">
                        {op}
                      </blockquote>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <Chatbot articleId={article.id} />
    </div>
  );
}
