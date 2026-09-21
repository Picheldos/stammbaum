import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import Logo from '@/components/blocks/Logo/Logo';
import LangSwitch from '@/components/ui/LangSwitch/LangSwitch';
import { SandwichState } from '@/recoil/sandwichState/athom';
import { logoutUser } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import {
    AuthCluster,
    Bar,
    BarInner,
    Burger,
    BtnOutline,
    BtnSolid,
    LeftCol,
    LogoCol,
    Nav,
    NavLink,
    RightCol,
    StyledLink,
    Username
} from './Header.styled';

export type AppHeaderVariant = 'marketing' | 'app';

export interface HeaderProps {
    variant?: AppHeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = 'marketing' }) => {
    const { t } = useTranslation('common');
    const { pathname } = useRouter();
    const router = useRouter();
    const { session, refresh } = useSession();
    const setSandwichOpen = useSetRecoilState(SandwichState);

    const toggleMenu = () => setSandwichOpen((open) => !open);

    const marketing = variant === 'marketing';

    const navItems: { href: string; labelKey: string }[] = [
        { href: '/tree', labelKey: 'nav.tree' },
        { href: '/cemetery', labelKey: 'nav.cemetery' }
    ];

    useEffect(() => {
        refresh();
    }, [pathname, refresh]);

    return (
        <Bar role="banner">
            <BarInner>
                <LeftCol>
                    <Nav aria-label={t('nav.ariaPrimary')}>
                        {navItems.map(({ href, labelKey }) => {
                            const active = pathname === href || pathname.startsWith(`${href}/`);
                            return (
                                <StyledLink key={href} href={href}>
                                    <NavLink as="span" $active={active}>
                                        {t(labelKey)}
                                    </NavLink>
                                </StyledLink>
                            );
                        })}
                    </Nav>
                </LeftCol>

                <LogoCol>
                    <Logo presentation="wordmark" tone="light" />
                </LogoCol>

                <RightCol>
                    {marketing && (
                        <AuthCluster>
                            {!session ? (
                                <>
                                    <StyledLink href="/tree">
                                        <BtnOutline type="button">{t('header.createTree')}</BtnOutline>
                                    </StyledLink>
                                    <StyledLink href="/login">
                                        <BtnSolid type="button">{t('header.login')}</BtnSolid>
                                    </StyledLink>
                                </>
                            ) : (
                                <>
                                    <Username>{session.username}</Username>
                                    <BtnOutline
                                        type="button"
                                        onClick={() => {
                                            void logoutUser().finally(() => {
                                                refresh();
                                                router.push('/');
                                            });
                                        }}
                                    >
                                        {t('header.logout')}
                                    </BtnOutline>
                                </>
                            )}
                        </AuthCluster>
                    )}
                    <LangSwitch tone="light" compact />
                    <Burger type="button" aria-label={t('nav.openMenu')} onClick={toggleMenu}>
                        <span />
                        <span />
                    </Burger>
                </RightCol>
            </BarInner>
        </Bar>
    );
};

export default Header;
