"use client";

import Link from "next/link";
import { Search, Sparkles, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-100">
              AI Newsroom
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-zinc-100 transition-colors">My ET</Link>
            <Link href="/markets" className="hover:text-zinc-100 transition-colors">Markets</Link>
            <Link href="/startups" className="hover:text-zinc-100 transition-colors">Startups</Link>
            <Link href="/tech" className="hover:text-zinc-100 transition-colors">Tech</Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <input 
              type="text" 
              placeholder="Search companies, topics..." 
              className="bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
            <Search className="w-5 h-5" />
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-300">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
