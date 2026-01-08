'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GoalWithChildren } from '@/types/goals';
import { GoalType } from '@prisma/client';
import { deleteGoal } from '@/app/actions/goals';
import GoalCard from './GoalCard';
import GoalEditor from './GoalEditor';
import GoalEmptyState from './GoalEmptyState';
import DeleteConfirmDialog from '@/components/destiny/DeleteConfirmDialog';
import { Plus } from 'lucide-react';

interface GoalHierarchyViewProps {
  goals: GoalWithChildren[];
  allGoals: { id: string; title: string; type: GoalType }[];
}

export default function GoalHierarchyView({
  goals,
  allGoals,
}: GoalHierarchyViewProps) {
  const t = useTranslations('Goals');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalWithChildren | null>(null);
  const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);
  const [parentTypeForNew, setParentTypeForNew] = useState<GoalType | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateGoal = () => {
    setEditingGoal(null);
    setParentIdForNew(null);
    setParentTypeForNew(null);
    setIsEditorOpen(true);
  };

  const handleEditGoal = (goal: GoalWithChildren) => {
    setEditingGoal(goal);
    setParentIdForNew(null);
    setParentTypeForNew(null);
    setIsEditorOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    const parent = allGoals.find((g) => g.id === parentId);
    setEditingGoal(null);
    setParentIdForNew(parentId);
    setParentTypeForNew(parent?.type || null);
    setIsEditorOpen(true);
  };

  const handleDeleteGoal = async () => {
    if (!deleteGoalId) return;
    setIsDeleting(true);
    try {
      await deleteGoal(deleteGoalId);
    } finally {
      setIsDeleting(false);
      setDeleteGoalId(null);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingGoal(null);
    setParentIdForNew(null);
    setParentTypeForNew(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-200">
          {t('hierarchy')}
        </h2>
        <button
          onClick={handleCreateGoal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          {t('createGoal')}
        </button>
      </div>

      {/* Goals List or Empty State */}
      {goals.length === 0 ? (
        <GoalEmptyState onCreateGoal={handleCreateGoal} />
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={setDeleteGoalId}
              onAddChild={handleAddChild}
            />
          ))}
        </div>
      )}

      {/* Goal Editor Modal */}
      <GoalEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        goal={editingGoal}
        parentId={parentIdForNew}
        parentType={parentTypeForNew}
        availableParents={allGoals}
      />

      {/* Delete Confirmation Dialog */}
      {deleteGoalId && (
        <DeleteConfirmDialog
          title={t('deleteGoal')}
          message={t('deleteGoalConfirm')}
          onConfirm={handleDeleteGoal}
          onCancel={() => setDeleteGoalId(null)}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
