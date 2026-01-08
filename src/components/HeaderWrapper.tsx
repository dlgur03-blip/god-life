'use client';

import LanguageSwitcher from './LanguageSwitcher';

export default function HeaderWrapper() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-end items-center px-4 py-3 bg-[rgba(0,0,0,0.2)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.1)]">
      <LanguageSwitcher />
    </header>
  );
}
