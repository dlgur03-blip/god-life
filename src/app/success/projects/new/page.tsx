'use client';

import { createSuccessProject } from '@/app/actions/success';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <Link href="/success" className="text-gray-500 hover:text-white flex items-center gap-2 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6">Initiate Protocol</h1>
        
        <form action={createSuccessProject} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Project Title</label>
            <input 
              name="title" 
              type="text" 
              placeholder="e.g. 100 Days of Code" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Start Date</label>
              <input 
                name="startDate" 
                type="date" 
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reminder</label>
              <input 
                name="reminderTime" 
                type="time" 
                defaultValue="09:00"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-black font-bold py-4 rounded-lg hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Generate 100-Day Grid
          </button>
        </form>
      </div>
    </main>
  );
}
