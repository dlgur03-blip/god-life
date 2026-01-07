'use client';

import { createRule } from '@/app/actions/discipline';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddRuleForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createRule(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new discipline..."
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none"
      />
      <button 
        type="submit"
        className="bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 rounded-xl px-6 flex items-center justify-center transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </form>
  );
}
