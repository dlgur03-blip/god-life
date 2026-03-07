'use client';

import { useState, useTransition } from 'react';
import { Clock, CalendarDays, Trash2, ChevronDown, ChevronUp, Sparkles, FolderOpen } from 'lucide-react';
import { updateTaskStatus, deleteTask } from '@/app/actions/tasks';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  scheduledTime: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface Labels {
  notStarted: string;
  inProgress: string;
  completed: string;
  noTasks: string;
  due: string;
  at: string;
  addViaAi: string;
  delete: string;
  uncategorized: string;
}

const statusConfig = {
  not_started: { color: 'var(--foreground-muted)', bg: 'var(--color-border)' },
  in_progress: { color: 'var(--color-taskboard)', bg: 'var(--color-taskboard)' },
  completed: { color: 'var(--color-success)', bg: 'var(--color-success)' },
};

export default function TaskBoard({
  tasks: initialTasks,
  grouped,
  labels,
}: {
  tasks: Task[];
  grouped: Record<string, Task[]>;
  labels: Labels;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState(initialTasks);
  const [showCompleted, setShowCompleted] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Group active tasks by category
  const activeGrouped: Record<string, Task[]> = {};
  activeTasks.forEach(t => {
    const key = t.category || '';
    if (!activeGrouped[key]) activeGrouped[key] = [];
    activeGrouped[key].push(t);
  });

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : t.completedAt } : t
    ));
    setUpdating(taskId);
    try {
      await updateTaskStatus(taskId, newStatus);
      startTransition(() => router.refresh());
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await deleteTask(taskId);
      startTransition(() => router.refresh());
    } catch {
      // Revert on error
      setTasks(initialTasks);
    }
  };

  const handleAiAdd = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat', {
      detail: { prompt: labels.addViaAi },
    }));
  };

  const isDueSoon = (dueDate: string | null) => {
    if (!dueDate) return false;
    const due = new Date(dueDate + 'T23:59:59');
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // 3 days
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const due = new Date(dueDate + 'T23:59:59');
    return due < new Date();
  };

  const renderTask = (task: Task) => {
    const config = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.not_started;
    const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
    const dueSoon = task.status !== 'completed' && !overdue && isDueSoon(task.dueDate);

    return (
      <div
        key={task.id}
        className={`border p-4 flex flex-col gap-2 transition-all ${
          overdue ? 'border-red-400/60' : 'border-[var(--color-border)]'
        } ${updating === task.id ? 'opacity-50' : ''}`}
        style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-card-bg)' }}
      >
        {/* Header: status dot + title */}
        <div className="flex items-start gap-2">
          <div
            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: config.bg, opacity: task.status === 'not_started' ? 0.4 : 0.8 }}
          />
          <h3 className={`font-semibold text-sm flex-1 ${
            task.status === 'completed' ? 'line-through text-[var(--foreground-muted)]' : 'text-[var(--foreground)]'
          }`}>
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-[var(--foreground-muted)] pl-5 line-clamp-2">{task.description}</p>
        )}

        {/* Meta: time, due date */}
        <div className="flex items-center gap-3 pl-5 flex-wrap">
          {task.scheduledTime && (
            <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
              <Clock className="w-3 h-3" />
              {labels.at} {task.scheduledTime}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-red-400 font-semibold' : dueSoon ? 'text-yellow-500' : 'text-[var(--foreground-muted)]'
            }`}>
              <CalendarDays className="w-3 h-3" />
              {labels.due} {task.dueDate}
            </span>
          )}
        </div>

        {/* Actions */}
        {task.status !== 'completed' && (
          <div className="flex items-center gap-2 pl-5 mt-1">
            {task.status === 'not_started' && (
              <button
                onClick={() => handleStatusChange(task.id, 'in_progress')}
                disabled={!!updating}
                className="text-[10px] px-2 py-0.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {labels.inProgress}
              </button>
            )}
            {task.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange(task.id, 'completed')}
                disabled={!!updating}
                className="text-[10px] px-2 py-0.5 border border-[var(--color-success)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white transition-all"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {labels.completed}
              </button>
            )}
            <button
              onClick={() => handleDelete(task.id)}
              disabled={!!updating}
              className="text-[10px] px-1.5 py-0.5 text-[var(--foreground-muted)] hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Add Button */}
      <button
        onClick={handleAiAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-all text-sm font-medium"
        style={{ borderRadius: 'var(--radius-lg)' }}
      >
        <Sparkles className="w-4 h-4" />
        {labels.addViaAi}
      </button>

      {/* Active Tasks by Category */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-16 text-[var(--foreground-muted)]">
          <ClipboardListIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{labels.noTasks}</p>
        </div>
      )}

      {Object.entries(activeGrouped).map(([category, tasks]) => (
        <div key={category}>
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-[var(--color-primary)]" />
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">
              {category || labels.uncategorized}
            </h2>
            <span className="text-xs text-[var(--foreground-muted)]">({tasks.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tasks.map(renderTask)}
          </div>
        </div>
      ))}

      {/* Completed Section (collapsible) */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mb-3"
          >
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {labels.completed} ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-60">
              {completedTasks.map(renderTask)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple fallback icon for empty state
function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
