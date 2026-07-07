import React from 'react';

export default function Hero() {
  return (
    <section className="pt-40 pb-20 px-6 flex flex-col items-center text-center bg-[radial-gradient(circle_at_50%_10%,rgba(79,70,229,0.06)_0%,transparent_50%)]">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-block bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
          Introducing Leela CRM
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6 max-w-2xl">
          Manage your customer relationships <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">effortlessly</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-xl">
          The next-generation CRM designed for modern teams. Streamline workflows, track leads, and close deals faster with beautiful visual pipelines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="#get-started" className="px-7 py-3.5 text-base font-semibold bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:-translate-y-0.5 transition-all text-center">
            Start Free Trial
          </a>
          <a href="#demo" className="px-7 py-3.5 text-base font-semibold border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 hover:-translate-y-0.5 transition-all text-center">
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}
