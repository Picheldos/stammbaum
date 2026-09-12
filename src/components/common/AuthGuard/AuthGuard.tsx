import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSession } from '@/hooks/useSession';
import { Gate } from './AuthGuard.styled';

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * Wrap any tree of authenticated-only content. While the client-side check is
 * in flight we render a small placeholder so the page never flashes a protected
 * UI for anonymous users.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, redirectTo = '/login' }) => {
    const router = useRouter();
    const { t } = useTranslation('tree');
    const { session, ready } = useSession();

    useEffect(() => {
        if (!ready) return;
        if (!session) {
            const next = encodeURIComponent(router.asPath || '/tree');
            router.replace(`${redirectTo}?next=${next}`);
        }
    }, [ready, session, redirectTo, router]);

    if (!ready) return <Gate>{t('authGuard.loading', { defaultValue: '…' })}</Gate>;
    if (!session) return <Gate>{t('authGuard.redirecting', { defaultValue: '…' })}</Gate>;
    return <>{children}</>;
};

export default AuthGuard;
