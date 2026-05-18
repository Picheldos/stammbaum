import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import Logo from '@/components/blocks/Logo/Logo';
import LangSwitch from '@/components/ui/LangSwitch/LangSwitch';
import { SandwichState } from '@/recoil/sandwichState/athom';
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
    RightCol
} from './Header.styled';

export type AppHeaderVariant = 'marketing' | 'app';

export interface HeaderProps {
    variant?: AppHeaderVariant;
}

const Header: React.FC<HeaderProps> = ({ variant = 'marketing' }) => {
    const { t } = useTranslation('common');
    const { pathname } = useRouter();
    const router = useRouter();
    const [sessionUser, setSessionUser] = useState<{ username: string; email: string } | null>(null);
    const setSandwichOpen = useSetRecoilState(SandwichState);

    const toggleMenu = () => setSandwichOpen((open) => !open);

    const marketing = variant === 'marketing';

    useEffect(() => {
        try {
            const raw = localStorage.getItem('stammbaum_session');
            if (raw) {
                const s = JSON.parse(raw);
                setSessionUser({ username: s.username, email: s.email });
            }
        } catch (e) {
            // ignore
        }
    }, []);

    const navItems: { href: string; labelKey: string }[] = [
        { href: '/about', labelKey: 'nav.about' },
        { href: '/tree', labelKey: 'nav.tree' },
        { href: '/cemetery', labelKey: 'nav.cemetery' }
    ];

    return (
        <Bar role="banner">
            <BarInner>
                <LeftCol>
                    <Nav aria-label={t('nav.ariaPrimary')}>
                        {navItems.map(({ href, labelKey }) => {
                            const active = pathname === href || pathname.startsWith(`${href}/`);
                            return (
                                <Link key={href} href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <NavLink as="span" $active={active}>
                                        {t(labelKey)}
                                    </NavLink>
                                </Link>
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
                            {!sessionUser ? (
                                <>
                                    <Link href="/login" style={{ textDecoration: 'none' }}>
                                        <BtnOutline type="button">{t('signIn')}</BtnOutline>
                                    </Link>
                                    <Link href="/login" style={{ textDecoration: 'none' }}>
                                        <BtnSolid type="button">{t('header.login')}</BtnSolid>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div style={{ color: 'white', opacity: 0.95 }}>{sessionUser.username}</div>
                                    <BtnOutline
                                        type="button"
                                        onClick={() => {
                                            try {
                                                localStorage.removeItem('stammbaum_session');
                                            } catch (e) {
                                                // ignore
                                            }
                                            setSessionUser(null);
                                            router.push('/');
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
                        <span />
                    </Burger>
                </RightCol>
            </BarInner>
        </Bar>
    );
};

export default Header;
