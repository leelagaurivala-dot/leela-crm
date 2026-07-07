import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-slate-100 dark:border-zinc-900 z-50 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight cursor-pointer">
          Leela<span className="text-indigo-600 dark:text-indigo-400">CRM</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            Features
          </a>
          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            About
          </a>
        </nav>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all cursor-pointer">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/20 hover:scale-[1.02] transition-all cursor-pointer">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
