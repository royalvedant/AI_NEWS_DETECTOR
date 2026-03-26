"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Presentation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock timeline data to simulate "Story Arc"
const mockTimelineData = [
  { date: 'Jan 22', sentiment: 40, priceImpact: 100, event: 'Initial Rumors' },
  { date: 'Feb 15', sentiment: 45, priceImpact: 102, event: 'Leaked Memo' },
  { date: 'Mar 10', sentiment: 75, priceImpact: 110, event: 'Official Announcement' },
  { date: 'Mar 25', sentiment: 60, priceImpact: 115, event: 'Regulatory Scrutiny' },
  { date: 'Apr 02', sentiment: 85, priceImpact: 125, event: 'Product Launch' },
  { date: 'Present', sentiment: 82, priceImpact: 128, event: 'Market Adoption' },
];

export default function StoryArcPage() {
  const { id } = useParams();
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/news/${id}`);
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchArticle();
  }, [id]);

  const [article, setArticle] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  if (!article) return <div className="animate-pulse h-screen flex justify-center items-center text-zinc-500">Loading Story Arc...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-in fade-in duration-700">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href={`/article/${article.id}`}>
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to Article
          </Button>
        </Link>
        <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium border border-indigo-500/20 flex items-center gap-2">
          <TrendingUp className="w-4 h-4"/> Story Arc Tracker
        </span>
      </div>

      <header className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 leading-tight">
          Evolution of: {article.headline}
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl">
          Track how this narrative unfolded over time, its sentiment correlation, and broader market impact.
        </p>
      </header>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sentiment Analysis Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-semibold text-zinc-200">Public Sentiment Flow</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="sentiment" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Impact Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Presentation className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-zinc-200">Sector Stock Correlation</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Line type="monotone" dataKey="priceImpact" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#18181b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Timeline Steps */}
      <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-zinc-100 mb-8">Key Milestones</h2>
        
        <div className="relative border-l-2 border-zinc-800 ml-3 space-y-10 pl-8">
          {mockTimelineData.map((node, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-zinc-950 border-2 border-indigo-500" />
              <div className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-1 block">
                  {node.date}
                </span>
                <h3 className="text-xl font-medium text-zinc-200">{node.event}</h3>
                <p className="text-zinc-500 mt-2 text-sm leading-relaxed max-w-2xl">
                  AI analysis of {node.sentiment}% positive sentiment indicates a strong market reception during this phase. 
                  Historical records show an associated sector bump correlated closely with this specific announcement.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
