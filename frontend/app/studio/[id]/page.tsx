"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, FileText, Mic, Image as ImageIcon, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoStudioPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [script, setScript] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [step, setStep] = useState(0); // 0: Init, 1: Script, 2: Audio, 3: Visuals, 4: Render, 5: Done
  
  // Progress states
  const [progress, setProgress] = useState(0);

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

  const startGeneration = async () => {
    setStep(1); // Script generation
    setProgress(15);
    
    try {
      // Simulate API call for script
      const res = await fetch(`http://localhost:3001/api/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: id })
      });
      const data = await res.json();
      
      if (data.success) {
        setScript(data.data);
        setProgress(35);
        
        // Simulate step 2: Audio (ElevenLabs)
        setTimeout(() => {
          setStep(2);
          setProgress(60);
          
          // Simulate step 3: Visuals
          setTimeout(() => {
            setStep(3);
            setProgress(85);
            
            // Simulate step 4: FFmpeg rendering
            setTimeout(() => {
              setStep(4);
              setProgress(100);
              setTimeout(() => setStep(5), 1000);
            }, 2500);
          }, 2000);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!article) return <div className="animate-pulse h-screen flex justify-center items-center text-zinc-500">Loading Studio...</div>;

  const stepsList = [
    { id: 1, name: "AI Script Extraction", icon: FileText },
    { id: 2, name: "ElevenLabs Narration", icon: Mic },
    { id: 3, name: "Slide Generation", icon: ImageIcon },
    { id: 4, name: "FFmpeg Compositing", icon: Video },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-in fade-in duration-700">
      
      <div className="flex items-center justify-between">
        <Link href={`/article/${article.id}`}>
          <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to Article
          </Button>
        </Link>
        <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20 flex items-center gap-2">
          <PlayCircle className="w-4 h-4"/> AI Video Studio
        </span>
      </div>

      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 leading-tight">
          One-Click Video Report
        </h1>
        <p className="text-zinc-400 text-lg">
          Convert &apos;{article.headline}&apos; into a polished, ready-to-publish vertical video with AI narration and dynamic visuals.
        </p>
      </header>

      {step === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-zinc-800 border-dashed rounded-3xl bg-zinc-900/30">
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-900/20">
            <Video className="w-10 h-10 text-rose-400" />
          </div>
          <h3 className="text-2xl font-semibold text-zinc-200 mb-2">Ready to Generate</h3>
          <p className="text-zinc-500 text-center max-w-md mb-8">
            This will consume ~1.5 credits and generate a 60-second video suitable for YouTube Shorts or Instagram Reels.
          </p>
          <Button size="lg" onClick={startGeneration} className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-8 h-12 text-lg">
            <PlayCircle className="w-5 h-5 mr-2" />
            Generate Now
          </Button>
        </div>
      )}

      {step > 0 && step < 5 && (
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-zinc-100 mb-8 text-center pulse">Pipeline Processing...</h2>
          
          <div className="space-y-6">
            {stepsList.map((s) => {
              const Icon = s.icon;
              const isPast = step > s.id;
              const isCurrent = step === s.id;
              
              let statusClass = "text-zinc-600";
              let bgClass = "bg-zinc-800";
              let iconClass = "text-zinc-500";
              
              if (isPast) {
                statusClass = "text-emerald-400";
                bgClass = "bg-emerald-500/20";
                iconClass = "text-emerald-400";
              } else if (isCurrent) {
                statusClass = "text-rose-400 font-medium";
                bgClass = "bg-rose-500/20 border border-rose-500/50";
                iconClass = "text-rose-400 animate-pulse";
              }

              return (
                <div key={s.id} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${bgClass}`}>
                    {isPast ? <CheckCircle2 className={`w-6 h-6 ${iconClass}`} /> : <Icon className={`w-5 h-5 ${iconClass}`} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg transition-colors ${statusClass}`}>{s.name}</h4>
                    {isCurrent && (
                      <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-rose-500 h-1.5 rounded-full w-full animate-progress" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-zinc-950 rounded-full h-2 mt-10 overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-rose-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {step === 5 && script && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Mock Video Player */}
          <div className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-zinc-800 shadow-2xl group flex flex-col justify-end p-6">
            {/* Background image simulated */}
            <div className="absolute inset-0 opacity-40">
              <img src={article.imageUrl} alt="Video Backdrop" className="w-full h-full object-cover blur-sm" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <Badge className="bg-rose-500 border-none">BREAKING</Badge>
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight leading-snug">
                {script.scenes[0].narration}
              </h2>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-rose-500" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm cursor-pointer">
              <PlayCircle className="w-20 h-20 text-white" />
            </div>
          </div>

          {/* Script Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Generated Script ({script.totalDurationSeconds}s)
            </h3>
            
            <div className="space-y-6">
              {script.scenes.map((scene: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                <div key={scene.id} className="relative pl-4 border-l-2 border-zinc-800">
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="flex justify-between items-start mb-1 text-xs text-zinc-500 uppercase font-semibold">
                    <span>Scene {scene.id}</span>
                    <span>{scene.durationSeconds}s</span>
                  </div>
                  <p className="text-zinc-300 text-sm mb-2">{scene.narration}</p>
                  <p className="text-indigo-400/80 text-xs italic">Visual: {scene.visual}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end gap-3">
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                Download Script
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Export Video (MP4)
              </Button>
            </div>
          </div>

        </div>
      )}
      
    </div>
  );
}
