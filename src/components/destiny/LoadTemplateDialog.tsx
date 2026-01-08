'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FolderOpen, X, Trash2, AlertTriangle, Download, Clock } from 'lucide-react';
import { getTemplates, loadTemplate, deleteTemplate } from '@/app/actions/destiny';
import type { DestinyTemplate } from '@/types/destiny';

type Props = {
  dayId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function LoadTemplateDialog({ dayId, onClose, onSuccess }: Props) {
  const t = useTranslations('Destiny.template');
  const tCommon = useTranslations('Common');
  const [templates, setTemplates] = useState<DestinyTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmLoadId, setConfirmLoadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data as DestinyTemplate[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (templateId: string) => {
    setLoadingId(templateId);
    setError(null);

    try {
      await loadTemplate(dayId, templateId);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setLoadingId(null);
      setConfirmLoadId(null);
    }
  };

  const handleDelete = async (templateId: string) => {
    setDeletingId(templateId);
    setError(null);

    try {
      await deleteTemplate(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
    } catch (e) {
      setError(e instanceof Error ? e.message : tCommon('errors.unknown'));
    } finally {
      setDeletingId(null);
    }
  };

  const formatBlockCount = (template: DestinyTemplate) => {
    const blocks = template.blocks as Array<unknown>;
    return t('blockCount', { count: blocks.length });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.8)]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-[#050b14] border border-[rgba(255,255,255,0.1)] rounded-lg p-6 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#f59e0b]" />
            {t('loadTitle')}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#e2e8f0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#9ca3af] mb-4">
          {t('loadDescription')}
        </p>

        {/* Confirm Load Warning */}
        {confirmLoadId && (
          <div className="mb-4 p-4 bg-[rgba(245,158,11,0.1)] border border-[#f59e0b] rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#e2e8f0] font-medium">
                  {t('loadWarningTitle')}
                </p>
                <p className="text-xs text-[#9ca3af] mt-1">
                  {t('loadWarningMessage')}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setConfirmLoadId(null)}
                    className="px-3 py-1.5 text-xs text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
                  >
                    {tCommon('cancel')}
                  </button>
                  <button
                    onClick={() => handleLoad(confirmLoadId)}
                    disabled={loadingId !== null}
                    className="px-3 py-1.5 text-xs bg-[#f59e0b] text-white rounded hover:bg-[#d97706] transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {loadingId === confirmLoadId && (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {t('confirmLoad')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mb-4 text-sm text-[#ef4444]">{error}</p>
        )}

        {/* Template List */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-[#4b5563] mx-auto mb-3" />
              <p className="text-[#6b7280]">{t('noTemplates')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg hover:border-[rgba(255,255,255,0.2)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#e2e8f0] font-medium truncate">
                        {template.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6b7280]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatBlockCount(template)}
                        </span>
                        <span>
                          {new Date(template.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setConfirmLoadId(template.id)}
                        disabled={loadingId !== null || deletingId !== null}
                        className="p-2 text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] rounded-lg transition-colors disabled:opacity-50"
                        title={t('load')}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        disabled={loadingId !== null || deletingId !== null}
                        className="p-2 text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors disabled:opacity-50"
                        title={tCommon('delete')}
                      >
                        {deletingId === template.id ? (
                          <div className="w-4 h-4 border-2 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#9ca3af] hover:text-[#e2e8f0] transition-colors"
          >
            {tCommon('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
