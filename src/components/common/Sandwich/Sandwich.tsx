import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { Container, SandwichMenu, SandwichMenuLink, SandwichTop } from './Sandwich.styled';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SandwichState } from '@/recoil/sandwichState/athom';
import { SizesState } from '@/recoil/commonState/athom';
import Link from 'next/link';
import CloseButton from '@/components/ui/CloseButton/CloseButton';

export interface SandwichProps {}

const Sandwich: React.FC<SandwichProps> = () => {
    const { t } = useTranslation('common');
    const [sandwichState, setSandwichState] = useRecoilState(SandwichState);

    const close = useCallback(() => {
        setSandwichState(false);
    }, [setSandwichState]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const el = document.querySelector('.sandwich-container');
            if (el && !el.contains(event.target as Node)) {
                close();
            }
        };

        if (sandwichState) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sandwichState, close]);

    const { isMobile } = useRecoilValue(SizesState);

    const allItems: { href: string; labelKey: string }[] = [
        { href: '/about', labelKey: 'nav.about' },
        { href: '/tree', labelKey: 'nav.tree' },
        { href: '/cemetery', labelKey: 'nav.cemetery' },
        { href: '/login', labelKey: 'nav.enter' },
        {  href: '#', labelKey: 'nav.feedback' }
    ];

    const items = isMobile ? allItems.filter((item) => item.href !== '/about') : allItems;

    return (
        <Container open={sandwichState} className="sandwich-container" aria-hidden={!sandwichState}>
            <SandwichTop>
                <CloseButton tone="light" onClick={close} />
            </SandwichTop>
            <SandwichMenu>
                {items.map(({ href, labelKey }) => (
                    <Link key={href} href={href} onClick={close} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <SandwichMenuLink as="span">{t(labelKey)}</SandwichMenuLink>
                    </Link>
                ))}
                {/* <SandwichMenuHint>{t('header.createTree')}</SandwichMenuHint>
                <SandwichMenuHint>{t('header.login')}</SandwichMenuHint> */}
            </SandwichMenu>
        </Container>
    );
};

export default Sandwich;
