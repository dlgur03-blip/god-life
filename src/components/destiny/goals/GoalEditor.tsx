'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GoalType, GoalStatus } from '@prisma/client';
import { GoalWithChildren, getValidParentTypes, GOAL_TYPE_ORDER } from '@/types/goals';
import { createGoal, updateGoal } from '@/app/actions/goals';
import { cn } from '@/lib/utils';
import { GOAL_COLORS } from '@/lib/goal-colors';
import GoalTypeSelector from './GoalTypeSelector';
import { X } from 'lucide-react';

interface GoalEditorProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: GoalWithChildren | null;
  parentId?: string | null;
  parentType?: GoalType | null;
  availableParents?: { id: string; title: string; type: GoalType }[];
}

export default function GoalEditor({
  isOpen,
  onClose,
  goal,
  parentId,
  parentType,
  availableParents = [],
}: GoalEditorProps) {
  const t = useTranslations('Goals');
  const tCommon = useTranslations('Common');

  const [type, setType] = useState<GoalType>(goal?.type || 'ONE_YEAR');
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(
    goal?.parentId || parentId || null
  );
  const [status, setStatus] = useState<GoalStatus>(goal?.status || 'ACTIVE');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!goal;

  // Reset form when goal changes
  useEffect(() => {
    if (goal) {
      setType(goal.type);
      setTitle(goal.title);
      setDescription(goal.description || '');
      setSelectedParentId(goal.parentId);
      setStatus(goal.status);
    } else {
      // If parent is specified, set initial type to valid child type
      if (parentType) {
        const parentIndex = GOAL_TYPE_ORDER.indexOf(parentType);
        if (parentIndex < GOAL_TYPE_ORDER.length - 1) {
          setType(GOAL_TYPE_ORDER[parentIndex + 1]);
        }
      }
      setSelectedParentId(parentId || null);
    }
  }, [goal, parentId, parentType]);

  // Get available parent options based on selected type
  const validParentTypes = getValidParentTypes(type);
  const filteredParents = availableParents.filter((p) =>
    validParentTypes.includes(p.type)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('validation.titleRequired'));
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditing && goal) {
        const result = await updateGoal(goal.id, {
          title: title.trim(),
          description: description.trim() || null,
          parentId: selectedParentId,
          status,
        });
        if (!result.success) {
          setError(tCommon(`errors.${result.error.toLowerCase()}`));
          return;
        }
      } else {
        const result = await createGoal({
          type,
          title: title.trim(),
          description: description.trim() || undefined,
          parentId: selectedParentId || undefined,
        });
        if (!result.success) {
          setError(tCommon(`errors.${result.error.toLowerCase()}`));
          return;
        }
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const colors = GOAL_COLORS[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#0a1628] rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ borderColor: colors.border }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border, backgroundColor: colors.bg }}
        >
          <h2
            className="text-lg font-bold"
            style={{ color: colors.primary }}
          >
            {isEditing ? t('editGoal') : t('createGoal')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Goal Type (only for new goals) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('goalType')}
              </label>
              <GoalTypeSelector value={type} onChange={setType} />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('titleLabel')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Parent Goal */}
          {filteredParents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('parentGoal')}
              </label>
              <select
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value || null)}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-gray-200 focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">{t('noParent')}</option>
                {filteredParents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    [{t(`types.${parent.type.toLowerCase()}`)}] {parent.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status (only for editing) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('statusLabel')}
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'] as GoalStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        status === s
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      )}
                    >
                      {t(`status.${s.toLowerCase()}`)}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'px-6 py-2 rounded-lg font-medium transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{
                backgroundColor: colors.primary,
                color: '#000',
              }}
            >
              {isSaving ? tCommon('status.saving') : tCommon('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
