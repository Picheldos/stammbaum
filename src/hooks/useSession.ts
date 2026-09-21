/**
 * Session/auth helper backed by the real backend.
 *
 * Источник истины — accessToken (lib/api.ts) + GET /users/me.
 * Refresh-token живёт только в HttpOnly cookie и из JS недоступен.
 * Интерфейс хука сохранён: { session, ready, refresh }.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { clearAccessSession, getAccessToken, getCurrentUser, refreshAccessToken, UserRead } from '@/lib/api';

export interface Session {
    username: string;
    email: string;
    token: string;
}

const toSession = (user: UserRead): Session => ({
    username: user.displayName,
    email: user.email,
    token: getAccessToken() ?? ''
});

// Ключ сессии из старых сборок. Сейчас источник истины — accessToken
// (lib/api.ts) + HttpOnly refresh-cookie stammbaum_refresh, поэтому JSON-снимок
// сессии в localStorage больше не читается и не пишется. Чистим лежалые записи.
const LEGACY_SESSION_KEY = 'stammbaum_session';

const purgeLegacyStorage = (): void => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(LEGACY_SESSION_KEY);
    } catch {
        // ignore
    }
};

export const clearSession = (): void => {
    clearAccessSession();
};

/**
 * Hook that exposes the current backend session.
 * `ready` flips to `true` only after the first bootstrap attempt
 * (accessToken -> /users/me, fallback -> refresh -> /users/me).
 */
export const useSession = (): { session: Session | null; ready: boolean; user: UserRead | null; refresh: () => void } => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<UserRead | null>(null);
    const [ready, setReady] = useState(false);
    const inFlight = useRef(false);

    const refresh = useCallback(() => {
        if (inFlight.current) return;
        inFlight.current = true;
        const load = async () => {
            try {
                const token = getAccessToken();
                if (!token) {
                    setSession(null);
                    setUser(null);
                    return;
                }
                try {
                    const me = await getCurrentUser();
                    setUser(me);
                    setSession(toSession(me));
                } catch {
                    // access протух — пробуем silent refresh один раз
                    try {
                        await refreshAccessToken();
                        const me = await getCurrentUser();
                        setUser(me);
                        setSession(toSession(me));
                    } catch {
                        setSession(null);
                        setUser(null);
                    }
                }
            } finally {
                setReady(true);
                inFlight.current = false;
            }
        };
        void load();
    }, []);

    useEffect(() => {
        purgeLegacyStorage();
        refresh();

        const onStorage = (event: StorageEvent) => {
            if (event.key === 'stammbaum_access_token') refresh();
        };
        const onCustom = () => refresh();

        window.addEventListener('storage', onStorage);
        window.addEventListener('stammbaum:session', onCustom);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('stammbaum:session', onCustom);
        };
    }, [refresh]);

    return { session, ready, user, refresh };
};

/** Fire a custom event so any `useSession` consumer in the same tab updates. */
export const notifySessionChanged = (): void => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event('stammbaum:session'));
};
