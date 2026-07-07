import React from 'react';

export default function Card({ title, description, icon }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-950 transition-all duration-300 flex flex-col items-start shadow-sm">
      <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl mb-5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
