import { getSuccessProjects } from '@/app/actions/success';
import Link from 'next/link';
import { Plus, Trophy, Calendar } from 'lucide-react';

export default async function SuccessPage() {
  const projects = await getSuccessProjects();

  return (
    <main className="min-h-screen bg-[url('/bg-grid.svg')] p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
             <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              SUCCESS CODE
            </h1>
            <p className="text-gray-400 text-sm">100 Days of Consistency</p>
          </div>
          <Link href="/success/projects/new" className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-primary/50">
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const progress = project.entries.length; // entries where isCompleted: true
            const percentage = Math.round(progress); // Total is 100, so count is percentage

            return (
              <Link key={project.id} href={`/success/project/${project.id}`} className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-primary/50 transition-all hover:translate-y-[-2px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-black/30 p-3 rounded-xl text-secondary group-hover:text-accent transition-colors">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-black/50 px-2 py-1 rounded">
                    Day {progress + 1} / 100
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-primary transition-colors">{project.title}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                  <Calendar className="w-3 h-3" />
                  Started {new Date(project.startDate).toLocaleDateString()}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Link>
            );
          })}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 mb-4">No active missions.</p>
              <Link href="/success/projects/new" className="text-primary hover:underline">Start your first 100-day journey</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
