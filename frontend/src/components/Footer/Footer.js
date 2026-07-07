import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 dark:border-zinc-900 py-8 px-6 bg-slate-50 dark:bg-zinc-950 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} Leela CRM. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#privacy" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
