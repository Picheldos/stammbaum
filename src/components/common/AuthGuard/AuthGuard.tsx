import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { useSession } from '@/hooks/useSession';
import { color, font } from '@/style/mixins';

const Gate = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 40px 16px;
    text-align: center;
    color: ${color('textPrimary')};
    ${font('font2')};
`;

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
