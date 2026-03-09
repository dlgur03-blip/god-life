'use client';

import { useState, useTransition, useCallback } from 'react';
import { Clock, CalendarDays, Trash2, ChevronDown, ChevronUp, Sparkles, FolderOpen, Plus, FolderPlus, ArrowRightLeft, GripVertical } from 'lucide-react';
import { updateTaskStatus, deleteTask, createTaskProject, deleteTaskProject, moveTaskToProject } from '@/app/actions/tasks';
import { useRouter } from 'next/navigation';
import { DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragOverEvent, type DragEndEvent } from '@dnd-kit/core';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  projectId: string | null;
  projectName: string | null;
  projectEmoji: string | null;
  projectColor: string | null;
  scheduledTime: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string;
  taskCount: number;
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

const STATUS_ORDER = ['not_started', 'in_progress', 'completed'] as const;

function DraggableTask({ task, children }: { task: Task; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : 1, transition: 'opacity 150ms' }}
    >
      <div className="flex items-stretch">
        <button
          {...listeners}
          {...attributes}
          className="flex items-center px-1 cursor-grab active:cursor-grabbing text-[var(--foreground-muted)] hover:text-[var(--foreground)] touch-none"
          style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}

function DroppableColumn({ id, label, statusKey, taskCount, isOver }: {
  id: string; label: string; statusKey: string; taskCount: number; isOver: boolean;
}) {
  const { setNodeRef, isOver: hovering } = useDroppable({ id });
  const config = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.not_started;
  const active = isOver || hovering;

  return (
    <div
      ref={setNodeRef}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-all"
      style={{
        borderRadius: 'var(--radius-full)',
        backgroundColor: active ? config.bg : 'transparent',
        color: active ? 'white' : config.bg,
        border: `1.5px solid ${config.bg}`,
        opacity: active ? 1 : 0.6,
        transform: active ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? 'white' : config.bg }} />
      {label} ({taskCount})
    </div>
  );
}

function DroppableProjectHeader({ projectId, children }: { projectId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `project:${projectId}` });
  return (
    <div
      ref={setNodeRef}
      style={{
        borderRadius: 'var(--radius-md)',
        outline: isOver ? '2px dashed var(--color-taskboard)' : '2px dashed transparent',
        outlineOffset: '2px',
        transition: 'outline-color 150ms',
      }}
    >
      {children}
    </div>
  );
}

export default function TaskBoard({
  tasks: initialTasks,
  projects: initialProjects,
  labels,
}: {
  tasks: Task[];
  projects: Project[];
  labels: Labels;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState(initialTasks);
  const [projects] = useState(initialProjects);
  const [showCompleted, setShowCompleted] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<string>>(new Set());
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectEmoji, setNewProjectEmoji] = useState('📁');
  const [movingTask, setMovingTask] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string | null;
    if (overId && STATUS_ORDER.includes(overId as typeof STATUS_ORDER[number])) {
      setOverColumn(overId);
    } else {
      setOverColumn(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumn(null);

    if (!over) return;

    const taskId = active.id as string;
    const dropTarget = over.id as string;

    // Dropped on a status column
    if (STATUS_ORDER.includes(dropTarget as typeof STATUS_ORDER[number])) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== dropTarget) {
        handleStatusChange(taskId, dropTarget);
      }
      return;
    }

    // Dropped on a project zone (prefixed with "project:")
    if (dropTarget.startsWith('project:')) {
      const projectId = dropTarget.replace('project:', '') || null;
      const task = tasks.find(t => t.id === taskId);
      if (task && task.projectId !== projectId) {
        handleMoveToProject(taskId, projectId);
      }
    }
  }, [tasks]);

  const draggedTask = activeId ? tasks.find(t => t.id === activeId) : null;

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Group by project
  const projectGroups: Record<string, Task[]> = { '': [] };
  projects.forEach(p => { projectGroups[p.id] = []; });
  activeTasks.forEach(t => {
    const key = t.projectId || '';
    if (!projectGroups[key]) projectGroups[key] = [];
    projectGroups[key].push(t);
  });

  const toggleCollapse = (projectId: string) => {
    setCollapsedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
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
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await deleteTask(taskId);
      startTransition(() => router.refresh());
    } catch {
      setTasks(initialTasks);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    await createTaskProject(newProjectName.trim(), newProjectEmoji);
    setNewProjectName('');
    setNewProjectEmoji('📁');
    setShowNewProject(false);
    startTransition(() => router.refresh());
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteTaskProject(projectId);
    startTransition(() => router.refresh());
  };

  const handleMoveToProject = async (taskId: string, projectId: string | null) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? {
        ...t,
        projectId,
        projectName: projectId ? projects.find(p => p.id === projectId)?.name ?? null : null,
        projectEmoji: projectId ? projects.find(p => p.id === projectId)?.emoji ?? null : null,
        projectColor: projectId ? projects.find(p => p.id === projectId)?.color ?? null : null,
      } : t
    ));
    setMovingTask(null);
    try {
      await moveTaskToProject(taskId, projectId);
      startTransition(() => router.refresh());
    } catch {
      setTasks(initialTasks);
    }
  };

  const handleAiAdd = () => {
    router.push(`/chat?prompt=${encodeURIComponent(labels.addViaAi)}`);
  };

  const isDueSoon = (dueDate: string | null) => {
    if (!dueDate) return false;
    const due = new Date(dueDate + 'T23:59:59');
    const diff = due.getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate + 'T23:59:59') < new Date();
  };

  const renderTaskCard = (task: Task) => {
    const config = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.not_started;
    const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
    const dueSoon = task.status !== 'completed' && !overdue && isDueSoon(task.dueDate);

    return (
      <div
        className={`border p-3 sm:p-4 flex flex-col gap-2 transition-all ${
          overdue ? 'border-[var(--color-error)]/40' : 'border-[var(--color-border)]'
        } ${updating === task.id ? 'opacity-50' : ''}`}
        style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-card-bg)' }}
      >
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

        {task.description && (
          <p className="text-xs text-[var(--foreground-muted)] pl-5 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center gap-3 pl-5 flex-wrap">
          {task.scheduledTime && (
            <span className="flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
              <Clock className="w-3 h-3" />
              {labels.at} {task.scheduledTime}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-[var(--color-error)] font-semibold' : dueSoon ? 'text-[var(--color-warning)]' : 'text-[var(--foreground-muted)]'
            }`}>
              <CalendarDays className="w-3 h-3" />
              {labels.due} {task.dueDate}
            </span>
          )}
        </div>

        {task.status !== 'completed' && (
          <div className="flex items-center gap-2 pl-5 mt-1 relative">
            {task.status === 'not_started' && (
              <button
                onClick={() => handleStatusChange(task.id, 'in_progress')}
                disabled={!!updating}
                className="text-[10px] px-2 py-0.5 border border-[var(--color-taskboard)] text-[var(--color-taskboard)] hover:bg-[var(--color-taskboard)] hover:text-white transition-all"
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
            {projects.length > 0 && (
              <button
                onClick={() => setMovingTask(movingTask === task.id ? null : task.id)}
                className="text-[10px] px-1.5 py-0.5 text-[var(--foreground-muted)] hover:text-[var(--color-taskboard)] transition-colors"
                title="Move to project"
              >
                <ArrowRightLeft className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => handleDelete(task.id)}
              disabled={!!updating}
              className="text-[10px] px-1.5 py-0.5 text-[var(--foreground-muted)] hover:text-[var(--color-error)] transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>

            {/* Move to project dropdown */}
            {movingTask === task.id && (
              <div
                className="absolute left-5 top-full mt-1 z-20 border border-[var(--color-border)] shadow-lg py-1 min-w-[160px] animate-scale-in"
                style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-card-bg)' }}
              >
                {task.projectId && (
                  <button
                    onClick={() => handleMoveToProject(task.id, null)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--color-card-hover)] transition-colors flex items-center gap-2 text-[var(--foreground-muted)]"
                  >
                    <FolderOpen className="w-3 h-3" />
                    {labels.uncategorized}
                  </button>
                )}
                {projects.filter(p => p.id !== task.projectId).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleMoveToProject(task.id, p.id)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--color-card-hover)] transition-colors flex items-center gap-2 text-[var(--foreground)]"
                  >
                    <span>{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTask = (task: Task) => {
    if (task.status === 'completed') {
      return <div key={task.id}>{renderTaskCard(task)}</div>;
    }
    return (
      <DraggableTask key={task.id} task={task}>
        {renderTaskCard(task)}
      </DraggableTask>
    );
  };

  const renderProjectSection = (projectId: string, projectTasks: Task[]) => {
    const project = projects.find(p => p.id === projectId);
    const isCollapsed = collapsedProjects.has(projectId);
    const isUncategorized = !projectId;
    const activeCount = projectTasks.length;
    const completedCount = isUncategorized
      ? completedTasks.filter(t => !t.projectId).length
      : completedTasks.filter(t => t.projectId === projectId).length;

    if (activeCount === 0 && completedCount === 0 && isUncategorized) return null;

    return (
      <div key={projectId || 'uncategorized'} className="animate-fade-in-up">
        {/* Project Header — droppable for moving tasks between projects */}
        <DroppableProjectHeader projectId={projectId || ''}>
        <div
          className="flex items-center gap-2 mb-3 cursor-pointer group"
          onClick={() => toggleCollapse(projectId || 'uncategorized')}
        >
          <button className="p-0.5 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {project ? (
            <>
              <span className="text-base">{project.emoji}</span>
              <h2
                className="text-sm font-bold text-[var(--foreground)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {project.name}
              </h2>
            </>
          ) : (
            <>
              <FolderOpen className="w-4 h-4 text-[var(--foreground-muted)]" />
              <h2 className="text-sm font-bold text-[var(--foreground-muted)]">
                {labels.uncategorized}
              </h2>
            </>
          )}
          <span className="text-xs text-[var(--foreground-muted)]">({activeCount})</span>

          {/* Progress bar */}
          {activeCount + completedCount > 0 && (
            <div className="flex-1 h-1.5 bg-[var(--color-border)] ml-2 max-w-[100px]" style={{ borderRadius: 'var(--radius-full)' }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.round((completedCount / (activeCount + completedCount)) * 100)}%`,
                  backgroundColor: project?.color || 'var(--foreground-muted)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          )}

          {project && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
              className="ml-auto p-1 text-[var(--foreground-muted)] hover:text-[var(--color-error)] opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
        </DroppableProjectHeader>

        {/* Tasks Grid */}
        {!isCollapsed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
            {projectTasks.map(renderTask)}
          </div>
        )}
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAiAdd}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-dashed border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-all text-sm font-medium"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <Sparkles className="w-4 h-4" />
          {labels.addViaAi}
        </button>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2 px-4 py-3 border border-[var(--color-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--color-border-hover)] transition-all text-sm font-medium"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <div
          className="flex items-center gap-2 p-3 border border-[var(--color-secondary)] animate-scale-in"
          style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-card-bg)' }}
        >
          <button
            onClick={() => {
              const emojis = ['📁', '🚀', '💡', '🎯', '💪', '📚', '🎨', '💼', '🏠', '❤️'];
              const idx = emojis.indexOf(newProjectEmoji);
              setNewProjectEmoji(emojis[(idx + 1) % emojis.length]);
            }}
            className="text-xl p-1 hover:bg-[var(--color-card-hover)] transition-colors"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {newProjectEmoji}
          </button>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            placeholder="프로젝트 이름..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--foreground)]"
            autoFocus
          />
          <button
            onClick={handleCreateProject}
            className="px-3 py-1 text-xs font-bold text-white bg-[var(--color-secondary)] hover:opacity-90 transition-opacity"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowNewProject(false)}
            className="px-2 py-1 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Status Drop Zones — visible when dragging */}
      {activeId && (
        <div
          className="flex items-center justify-center gap-3 py-3 px-4 border border-dashed border-[var(--color-border)] animate-scale-in"
          style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-card-bg)' }}
        >
          {STATUS_ORDER.map(status => {
            const statusLabel = status === 'not_started' ? labels.notStarted : status === 'in_progress' ? labels.inProgress : labels.completed;
            const count = tasks.filter(t => t.status === status).length;
            return (
              <DroppableColumn
                key={status}
                id={status}
                label={statusLabel}
                statusKey={status}
                taskCount={count}
                isOver={overColumn === status}
              />
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--foreground-muted)] animate-fade-in-up">
          <span className="text-4xl mb-3">📋</span>
          <p className="font-medium">{labels.noTasks}</p>
        </div>
      )}

      {/* Project Sections */}
      {projects.map(p => renderProjectSection(p.id, projectGroups[p.id] || []))}

      {/* Uncategorized */}
      {renderProjectSection('', projectGroups[''] || [])}

      {/* Completed Section */}
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

    {/* Drag Overlay — ghost card while dragging */}
    <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
      {draggedTask ? (
        <div style={{ width: 300, opacity: 0.9, transform: 'rotate(2deg)' }}>
          {renderTaskCard(draggedTask)}
        </div>
      ) : null}
    </DragOverlay>
    </DndContext>
  );
}
