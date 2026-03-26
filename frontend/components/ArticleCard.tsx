import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Article {
  id: string;
  headline: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  industry: string;
  readTimeMin: number;
  imageUrl: string;
  source: string;
  publishedAt: string;
  companies: string[];
}

export default function ArticleCard({ article }: { article: Article }) {
  const SentimentIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus
  }[article.sentiment];

  const sentimentColor = {
    positive: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    negative: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    neutral: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
  }[article.sentiment];

  return (
    <Link href={`/article/${article.id}`}>
      <Card className="group h-full flex flex-col bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/80 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-zinc-200 border-zinc-800">
            {article.source}
          </Badge>
          <Badge variant="outline" className={`absolute top-3 right-3 backdrop-blur-sm ${sentimentColor} flex items-center gap-1`}>
            <SentimentIcon className="w-3 h-3" />
            <span className="capitalize">{article.sentiment}</span>
          </Badge>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20">
              {article.industry}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg leading-snug text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
            {article.headline}
          </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-zinc-400 line-clamp-3">
            {article.summary}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-zinc-500 mt-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTimeMin} min read</span>
          </div>
          <span>
            {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
