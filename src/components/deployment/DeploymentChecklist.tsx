'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Circle, RefreshCw } from 'lucide-react';

type CheckStatus = 'pending' | 'passed' | 'failed';

interface CheckItem {
  id: string;
  category: string;
  label: string;
  status: CheckStatus;
  notes?: string;
}

const initialChecklist: CheckItem[] = [
  // Build Verification
  { id: 'ts', category: 'Build', label: 'TypeScript compilation', status: 'pending' },
  { id: 'eslint', category: 'Build', label: 'ESLint verification', status: 'pending' },
  { id: 'build', category: 'Build', label: 'Production build', status: 'pending' },

  // Locale Verification
  { id: 'locale-ko', category: 'Locales', label: 'Korean (ko) translations', status: 'pending' },
  { id: 'locale-en', category: 'Locales', label: 'English (en) translations', status: 'pending' },
  { id: 'locale-ja', category: 'Locales', label: 'Japanese (ja) translations', status: 'pending' },
  { id: 'lang-switcher', category: 'Locales', label: 'Language switcher works', status: 'pending' },

  // Navigation
  { id: 'nav-routes', category: 'Navigation', label: 'All routes accessible', status: 'pending' },
  { id: 'nav-404', category: 'Navigation', label: '404 handling works', status: 'pending' },
  { id: 'nav-links', category: 'Navigation', label: 'Navigation links preserved', status: 'pending' },

  // Authentication
  { id: 'auth-signin', category: 'Auth', label: 'Sign in flow', status: 'pending' },
  { id: 'auth-signout', category: 'Auth', label: 'Sign out flow', status: 'pending' },
  { id: 'auth-protected', category: 'Auth', label: 'Protected routes', status: 'pending' },

  // API
  { id: 'api-health', category: 'API', label: 'Health endpoint returns OK', status: 'pending' },
  { id: 'api-auth', category: 'API', label: 'Auth API routes', status: 'pending' },

  // Environment
  { id: 'env-db', category: 'Environment', label: 'DATABASE_URL configured', status: 'pending' },
  { id: 'env-secret', category: 'Environment', label: 'NEXTAUTH_SECRET configured', status: 'pending' },
  { id: 'env-url', category: 'Environment', label: 'NEXTAUTH_URL configured', status: 'pending' },

  // UI/UX
  { id: 'ui-console', category: 'UI/UX', label: 'No console errors', status: 'pending' },
  { id: 'ui-responsive', category: 'UI/UX', label: 'Responsive design', status: 'pending' },
  { id: 'ui-assets', category: 'UI/UX', label: 'All assets loading', status: 'pending' },
];

// Design tokens
const tokens = {
  primary: '#06b6d4',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  background: '#050b14',
  surface: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  textPrimary: '#e2e8f0',
  textSecondary: '#9ca3af',
};

export default function DeploymentChecklist() {
  const [checklist, setChecklist] = useState<CheckItem[]>(initialChecklist);

  const toggleStatus = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: CheckStatus =
          item.status === 'pending'
            ? 'passed'
            : item.status === 'passed'
            ? 'failed'
            : 'pending';
        return { ...item, status: nextStatus };
      })
    );
  };

  const resetAll = () => {
    setChecklist(initialChecklist);
  };

  const categories = [...new Set(checklist.map((item) => item.category))];
  const passedCount = checklist.filter((item) => item.status === 'passed').length;
  const failedCount = checklist.filter((item) => item.status === 'failed').length;
  const totalCount = checklist.length;

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 size={20} color={tokens.success} />;
      case 'failed':
        return <XCircle size={20} color={tokens.error} />;
      default:
        return <Circle size={20} color={tokens.textSecondary} />;
    }
  };

  return (
    <div
      style={{
        backgroundColor: tokens.background,
        color: tokens.textPrimary,
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: '0.25rem',
              }}
            >
              Deployment Checklist
            </h1>
            <p style={{ color: tokens.textSecondary, fontSize: '0.875rem' }}>
              God Life Maker - Web Deployment Readiness
            </p>
          </div>
          <button
            onClick={resetAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: tokens.surface,
              border: `1px solid ${tokens.border}`,
              borderRadius: '0.375rem',
              color: tokens.textPrimary,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        {/* Progress Summary */}
        <div
          style={{
            backgroundColor: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ color: tokens.textSecondary }}>Progress</span>
            <span>
              <span style={{ color: tokens.success }}>{passedCount}</span>
              <span style={{ color: tokens.textSecondary }}> / </span>
              <span>{totalCount}</span>
              {failedCount > 0 && (
                <span style={{ color: tokens.error, marginLeft: '0.5rem' }}>
                  ({failedCount} failed)
                </span>
              )}
            </span>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: tokens.border,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(passedCount / totalCount) * 100}%`,
                backgroundColor:
                  failedCount > 0
                    ? tokens.warning
                    : passedCount === totalCount
                    ? tokens.success
                    : tokens.primary,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Checklist by Category */}
        {categories.map((category) => (
          <div key={category} style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: tokens.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
              }}
            >
              {category}
            </h2>
            <div
              style={{
                backgroundColor: tokens.surface,
                border: `1px solid ${tokens.border}`,
                borderRadius: '0.5rem',
                overflow: 'hidden',
              }}
            >
              {checklist
                .filter((item) => item.category === category)
                .map((item, index, arr) => (
                  <button
                    key={item.id}
                    onClick={() => toggleStatus(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom:
                        index < arr.length - 1
                          ? `1px solid ${tokens.border}`
                          : 'none',
                      color: tokens.textPrimary,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255,255,255,0.03)')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    {getStatusIcon(item.status)}
                    <span
                      style={{
                        flex: 1,
                        textDecoration:
                          item.status === 'passed' ? 'line-through' : 'none',
                        opacity: item.status === 'passed' ? 0.7 : 1,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: tokens.textSecondary,
                      }}
                    >
                      Click to toggle
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}

        {/* Deployment Ready Status */}
        {passedCount === totalCount && failedCount === 0 && (
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: `1px solid ${tokens.success}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <CheckCircle2
              size={32}
              color={tokens.success}
              style={{ marginBottom: '0.5rem' }}
            />
            <p
              style={{
                color: tokens.success,
                fontWeight: '600',
                fontSize: '1.125rem',
              }}
            >
              Ready for Deployment
            </p>
            <p style={{ color: tokens.textSecondary, fontSize: '0.875rem' }}>
              All checks passed. The application is production-ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
