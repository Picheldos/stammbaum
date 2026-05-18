/**
 * Session/auth helper backed by LocalStorage. Mirrors the existing pattern
 * established in `pages/login.tsx` (keys `stammbaum_session` / `stammbaum_users`).
 */

import { useCallback, useEffect, useState } from 'react';

export interface Session {
    username: string;
    email: string;
    token: string;
}

const KEY = 'stammbaum_session';

export const readSession = (): Session | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && typeof parsed.username === 'string') {
            return parsed as Session;
        }
        return null;
    } catch {
        return null;
    }
};

export const clearSession = (): void => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
};

/**
 * Hook that exposes the current session and tracks login/logout that happens
 * in other tabs (storage event) or other components in this tab (custom event).
 *
 * `ready` flips to `true` only after the first client-side read so SSR doesn't
 * trigger redirect logic before LocalStorage is available.
 */
export const useSession = (): { session: Session | null; ready: boolean; refresh: () => void } => {
    const [session, setSession] = useState<Session | null>(null);
    const [ready, setReady] = useState(false);

    const refresh = useCallback(() => {
        setSession(readSession());
    }, []);

    useEffect(() => {
        refresh();
        setReady(true);

        const onStorage = (event: StorageEvent) => {
            if (event.key === KEY) refresh();
        };
        const onCustom = () => refresh();

        window.addEventListener('storage', onStorage);
        window.addEventListener('stammbaum:session', onCustom);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('stammbaum:session', onCustom);
        };
    }, [refresh]);

    return { session, ready, refresh };
};

/** Fire a custom event so any `useSession` consumer in the same tab updates. */
export const notifySessionChanged = (): void => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('stammbaum:session'));
};
