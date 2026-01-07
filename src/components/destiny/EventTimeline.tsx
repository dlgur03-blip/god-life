'use client';

import { useState } from 'react';
import { createDestinyEvent } from '@/app/actions/destiny';
import { Plus, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Event = {
  id: string;
  title: string;
  recordedAt: Date;
};

export default function EventTimeline({ dayId, events }: { dayId: string, events: Event[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await createDestinyEvent(dayId, newTitle);
    setNewTitle('');
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <section className="mt-8 mb-24 relative">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 px-2">Flow of Events</h2>
      
      {/* Timeline */}
      <div className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-6">
        {events.length === 0 && (
          <p className="text-gray-600 italic text-sm">No significant events recorded yet.</p>
        )}
        
        {events.map((event) => (
          <div key={event.id} className="relative group">
            <span className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-black border-2 border-white/20 group-hover:border-primary transition-colors" />
            
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="text-xs text-primary font-mono font-bold">
                {new Date(event.recordedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
              <p className="text-gray-200 text-sm bg-white/5 p-2 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors w-full">
                {event.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="bg-black/90 border border-white/20 rounded-2xl p-4 w-80 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in slide-in-from-bottom-5">
             <div className="flex justify-between items-center mb-3">
               <h3 className="text-sm font-bold text-gray-300">Record Event</h3>
               <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                 <X className="w-4 h-4" />
               </button>
             </div>
             <form onSubmit={handleSubmit}>
               <input
                 autoFocus
                 type="text"
                 value={newTitle}
                 onChange={(e) => setNewTitle(e.target.value)}
                 placeholder="What just happened?"
                 className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none mb-3"
               />
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded-lg py-2 text-sm font-bold transition-all"
               >
                 {isSubmitting ? 'Recording...' : 'Record to Timeline'}
               </button>
             </form>
          </div>
        ) : (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
}
