// src/components/LogoutButton.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, RefreshCw } from 'lucide-react';

interface LogoutButtonProps {
  /** Optional: clear local IndexedDB records on logout (recommended on shared exam center PCs) */
  clearLocalDb?: boolean;
  className?: string;
}

export default function LogoutButton({
  clearLocalDb = false,
  className = '',
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // 1. Call server logout endpoint to expire the HttpOnly 'examvia_token' cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // 2. Optionally wipe local IndexedDB cache if requested for shared terminals
      if (clearLocalDb) {
        const { db } = await import('@/lib/db');
        await Promise.all([db.exams.clear(), db.studentRecords.clear()]);
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // 3. Refresh Next.js router cache so middleware sees cookie removal, then redirect to /login
      router.refresh();
      router.replace('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      title="Sign out of Examvia"
      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200/80 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black uppercase tracking-wider transition-all shadow-2xs cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoggingOut ? (
        <>
          <RefreshCw size={13} className="animate-spin" />
          <span>Signing Out</span>
        </>
      ) : (
        <>
          <LogOut size={13} />
          <span>Logout</span>
        </>
      )}
    </button>
  );
}