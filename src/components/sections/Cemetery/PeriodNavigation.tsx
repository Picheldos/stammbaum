import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SandwichState } from '@/recoil/sandwichState/athom';
import { SizesState } from '@/recoil/commonState/athom';
import { useMedia } from '@/hooks/useMedia';
import SearchIcon from '@/icons/seach1.svg';
import PeriodChip from './PeriodChip';
import type { CemeteryPeriod } from './Cemetery.types';
import {
    NavIconButton,
    PeriodChipRow,
    PeriodInput,
    PeriodInputArrow,
    PeriodInputWrap,
    PeriodNavRail,
    PeriodNavTools
} from './Cemetery.styled';

export interface PeriodNavigationProps {
    periods: CemeteryPeriod[];
    activeId: string | null;
    onPeriodClick: (id: string) => void;
}

const PeriodNavigation: React.FC<PeriodNavigationProps> = ({ periods, activeId, onPeriodClick }) => {
    const { t } = useTranslation('cemetery');
    const { t: tCommon } = useTranslation('common');
    const router = useRouter();
    const { isMobile } = useRecoilValue(SizesState);
    const openSandwich = useSetRecoilState(SandwichState);

    const isDesktop = useMedia('(min-width: 1024px)', !isMobile);
    const isWide = useMedia('(min-width: 1440px)', false);

    const [yearQuery, setYearQuery] = useState('');

    const handleSearch = () => {
        router.push('/search');
    };

    const handleMenu = () => {
        if (!isMobile) return;
        openSandwich(true);
    };

    const handleYearSearch = () => {
        const yearStr = yearQuery.trim();
        const year = parseInt(yearStr, 10);
        if (!Number.isNaN(year)) {
            const period = periods.find((p) => year >= p.startYear && year <= p.endYear);
            if (period) onPeriodClick(period.id);
        }
        setYearQuery('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleYearSearch();
        }
    };

    return (
        <PeriodNavRail aria-label={t('periodInput') || 'periods'} role="navigation">
            <PeriodChipRow>
                {periods.map((p) => (
                    <PeriodChip
                        key={p.id}
                        label={p.label}
                        active={p.id === activeId}
                        onClick={() => onPeriodClick(p.id)}
                    />
                ))}
            </PeriodChipRow>

            {isDesktop && (
                <PeriodNavTools>
                    {!isWide && (
                        <PeriodInputWrap aria-label={t('periodInput')}>
                            <PeriodInput
                                type="text"
                                inputMode="numeric"
                                placeholder={t('periodInput')}
                                value={yearQuery}
                                onChange={(e) => setYearQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            <PeriodInputArrow
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                onClick={handleYearSearch}
                                style={{ cursor: 'pointer' }}
                            >
                                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </PeriodInputArrow>
                        </PeriodInputWrap>
                    )}

                    {isWide && (
                        <>
                            <NavIconButton type="button" aria-label={tCommon('openSearch')} onClick={handleSearch}>
                                <SearchIcon />
                            </NavIconButton>
                            <NavIconButton type="button" aria-label={tCommon('nav.openMenu')} onClick={handleMenu}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
                                    <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
                                    <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
                                </svg>
                            </NavIconButton>
                        </>
                    )}
                </PeriodNavTools>
            )}
        </PeriodNavRail>
    );
};

export default PeriodNavigation;
