'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useSetRecoilState } from 'recoil';
import { SandwichState } from '@/recoil/sandwichState/athom';
import { useSession } from '@/hooks/useSession';
import { listPersons, listRelations, listTrees } from '@/lib/family/storage';
import { labelForRelation } from '@/lib/family/relations';
import type { Person, PersonRelation } from '@/lib/family/types';
import {
    AddRelativeButton,
    CemeterySection,
    FloatingIconButton,
    FloatingTopLeft,
    FloatingTopRight,
    PageBackground,
    ScrollViewport,
    TimelineLine,
    TimelineTrack,
    TimelineYear,
    YearDot,
    YearLabel,
    TimelineMarker,
    DeathYearLabel
} from './Cemetery.styled';
import PeriodNavigation from './PeriodNavigation';
import PersonNode from '../FamilyTree/PersonNode';
import type { CemeteryPeriod, CemeteryPerson } from './Cemetery.types';
import {
    CARD_GAP,
    CARD_HEIGHT_DESKTOP,
    CARD_HEIGHT_MOBILE,
    CARD_STACK_DESKTOP,
    CARD_STACK_MOBILE,
    findPeriodForYear,
    formatPersonName,
    LINE_BOTTOM_OFFSET,
    PIXELS_PER_YEAR_DESKTOP,
    PIXELS_PER_YEAR_MOBILE,
    TRACK_PADDING,
    computeAxisPos,
    computePersonNodes,
    parsePeriods,
    parsePersons
} from './cemeteryUtils';
import { useMedia } from '@/hooks/useMedia';

export interface CemeteryProps {
    periods?: CemeteryPeriod[];
    persons?: CemeteryPerson[];
}

const BurgerIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
);

const SearchIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="6" />
        <line x1="20" y1="20" x2="16.5" y2="16.5" strokeLinecap="round" />
    </svg>
);

/** Main orchestrator for the Virtual Cemetery timeline. */
const Cemetery: React.FC<CemeteryProps> = ({ periods: periodsProp, persons: personsProp }) => {
    const { t } = useTranslation('cemetery');
    const { t: tTree } = useTranslation('tree');
    const { session } = useSession();
    const viewportRef = useRef<HTMLDivElement>(null);
    const openSandwich = useSetRecoilState(SandwichState);

    // Same relatives data as the Family tree page (lib/family/storage.ts): we
    // read the user's first tree and keep only persons with a recorded death
    // date — those are the only ones moved onto the timeline. `familyPersons`
    // stays `null` until a session is known, so SSR and anonymous visitors
    // keep seeing the demo persons from the cemetery locale.
    const [familyPersons, setFamilyPersons] = useState<Person[] | null>(null);
    const [familyRelations, setFamilyRelations] = useState<PersonRelation[]>([]);
    const [focusId, setFocusId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!session) {
            setFamilyPersons(null);
            setFamilyRelations([]);
            setFocusId(undefined);
            return;
        }
        const tree = listTrees(session.username)[0];
        if (!tree) {
            setFamilyPersons([]);
            setFamilyRelations([]);
            setFocusId(undefined);
            return;
        }
        setFamilyPersons(listPersons(tree.id));
        setFamilyRelations(listRelations(tree.id));
        setFocusId(tree.rootPersonId);
    }, [session]);

    const periods = useMemo(
        () => parsePeriods(periodsProp ?? t('periods', { returnObjects: true })),
        [periodsProp, t]
    );

    const allPersons = useMemo(() => {
        // Explicit page props win over both sources (tests / static previews).
        if (personsProp) return parsePersons(personsProp);

        // Signed-in users: only relatives with a death date reach the timeline.
        if (familyPersons !== null) {
            return familyPersons
                .filter(
                    (p): p is Person & { deathDate: string } =>
                        !p.isHidden && Boolean(p.deathDate)
                )
                .map((p) => ({
                    id: p.id,
                    firstName: p.firstName,
                    lastName: p.lastName,
                    relation: String(
                        labelForRelation(p, focusId, familyRelations, tTree) ??
                            tTree('relativeLabel.relative', { defaultValue: 'Relative' })
                    ),
                    birthDate: p.birthDate,
                    deathDate: p.deathDate,
                    photoUrl: p.photo || undefined
                }));
        }

        // Anonymous demo data from the cemetery locale.
        return parsePersons(t('persons', { returnObjects: true }));
    }, [personsProp, familyPersons, focusId, familyRelations, tTree, t]);

    const isDesktop = useMedia('(min-width: 768px)', false);
    const pixelsPerYear = isDesktop ? PIXELS_PER_YEAR_DESKTOP : PIXELS_PER_YEAR_MOBILE;

    const [activeId, setActiveId] = useState<string | null>(null);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const frameRef = useRef<number | null>(null);
    const programmaticScrollRef = useRef(false);

    const startYear = periods[0]?.startYear ?? 1700;
    const endYear = periods[periods.length - 1]?.endYear ?? 2026;
    const totalYears = endYear - startYear;

    const handlePeriodClick = (id: string) => {
        setActiveId(id);

        const viewport = viewportRef.current;
        const period = periods.find((p) => p.id === id);
        if (!viewport || !period) return;

        const target = computeAxisPos(period.startYear, startYear, endYear, pixelsPerYear);
        const viewportSize = isDesktop ? viewport.clientWidth : viewport.clientHeight;
        const scrollTarget = Math.max(0, target - viewportSize / 2);
        programmaticScrollRef.current = true;
        viewport.scrollTo({
            [isDesktop ? 'left' : 'top']: scrollTarget,
            behavior: 'smooth'
        });
    };

    const personNodes = useMemo(
        () =>
            computePersonNodes(
                allPersons,
                startYear,
                endYear,
                pixelsPerYear,
                isDesktop ? CARD_HEIGHT_DESKTOP : CARD_HEIGHT_MOBILE
            ),
        [allPersons, startYear, endYear, pixelsPerYear, isDesktop]
    );
    const maxRow = personNodes.reduce((max, n) => Math.max(max, n.row), 0);

    const handleMenuClick = () => {
        openSandwich(true);
    };

    // Search over the memorial cards currently rendered on the timeline.
    // Mirrors the tree-page flow: prompt → match by name → focus the result.
    const handleSearchClick = () => {
        const query = window.prompt(t('controls.searchPrompt', { defaultValue: 'Search by name' }) || '');
        if (!query) return;

        const normalized = query.trim().toLowerCase();
        const node = personNodes.find((n) => formatPersonName(n).toLowerCase().includes(normalized));
        if (!node) {
            window.alert(t('controls.notFound', { defaultValue: 'Person not found' }));
            return;
        }

        const viewport = viewportRef.current;
        if (viewport) {
            const viewportSize = isDesktop ? viewport.clientWidth : viewport.clientHeight;
            const scrollTarget = Math.max(0, node.axisPos - viewportSize / 2);
            programmaticScrollRef.current = true;
            viewport.scrollTo({
                [isDesktop ? 'left' : 'top']: scrollTarget,
                behavior: 'smooth'
            });
        }

        const period = findPeriodForYear(node.deathYear, periods);
        if (period) setActiveId(period.id);
        setHighlightId(node.id);
    };

    // The search glow fades after a short pause so the timeline stays calm.
    useEffect(() => {
        if (!highlightId) return;
        const timer = window.setTimeout(() => setHighlightId(null), 3000);
        return () => window.clearTimeout(timer);
    }, [highlightId]);

    const yearTicks = useMemo(() => {
        const ticks: { year: number; axisPos: number }[] = [];
        periods.forEach((p) => {
            ticks.push({
                year: p.startYear,
                axisPos: computeAxisPos(p.startYear, startYear, endYear, pixelsPerYear)
            });
        });
        if (periods.length) {
            ticks.push({
                year: endYear,
                axisPos: computeAxisPos(endYear, startYear, endYear, pixelsPerYear)
            });
        }
        return ticks;
    }, [periods, startYear, endYear, pixelsPerYear]);

    const trackWidth = 2 * TRACK_PADDING + totalYears * pixelsPerYear;
    const trackHeight = isDesktop
        ? (maxRow + 1) * CARD_STACK_DESKTOP + LINE_BOTTOM_OFFSET + 40
        : 2 * TRACK_PADDING + totalYears * pixelsPerYear;

    // Keep the active chip in sync with manual scrolling. The scroll listener
    // is passive and state is updated at most once per animation frame, which
    // avoids the scroll -> setState -> scroll feedback loop.
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport || periods.length === 0) return;

        const syncActivePeriod = () => {
            if (programmaticScrollRef.current) return;

            const offset = isDesktop ? viewport.scrollLeft : viewport.scrollTop;
            const visibleSize = isDesktop ? viewport.clientWidth : viewport.clientHeight;
            const visibleYear = startYear + (offset + visibleSize / 2) / pixelsPerYear;
            const period = findPeriodForYear(Math.round(visibleYear), periods);

            if (period && period.id !== activeId) {
                setActiveId(period.id);
            }
        };

        const onScroll = () => {
            if (frameRef.current !== null) return;
            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = null;
                syncActivePeriod();
            });
        };

        viewport.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            viewport.removeEventListener('scroll', onScroll);
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [activeId, isDesktop, periods, pixelsPerYear, startYear]);

    // `scrollTo({ behavior: 'smooth' })` does not expose a completion event.
    // A short timeout is enough to restore manual-scroll synchronization after
    // the transition, and the cleanup keeps it safe on breakpoint changes.
    useEffect(() => {
        if (!programmaticScrollRef.current) return;
        const timer = window.setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 600);

        return () => window.clearTimeout(timer);
    }, [activeId]);

    // Vertical mouse-wheel scrolls the horizontal timeline (desktop).
    // Page scrolling is only hijacked while the timeline can actually scroll.
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0 || el.scrollWidth <= el.clientWidth) return;
            const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
            const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
            if (atStart || atEnd) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <CemeterySection>
            <PageBackground aria-hidden="true">
                <Image
                    src="/images/cemetery/cemetery-bg-fhd.jpg"
                    fill
                    alt=""
                    quality={100}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    sizes="100vw"
                />
            </PageBackground>
            <FloatingTopLeft>
                <FloatingIconButton
                    type="button"
                    aria-label={t('controls.search', { defaultValue: 'Search' })}
                    onClick={handleSearchClick}
                >
                    <SearchIcon />
                </FloatingIconButton>
            </FloatingTopLeft>
            <FloatingTopRight>
                <FloatingIconButton
                    type="button"
                    aria-label={t('controls.menu', { defaultValue: 'Menu' })}
                    onClick={handleMenuClick}
                >
                    <BurgerIcon />
                </FloatingIconButton>
            </FloatingTopRight>
            <PeriodNavigation periods={periods} activeId={activeId} onPeriodClick={handlePeriodClick} />
            <ScrollViewport ref={viewportRef}>
                <TimelineTrack $width={trackWidth} $height={trackHeight}>
                    <TimelineLine $mobile={!isDesktop} />
                    {yearTicks.map((tick) => (
                        <TimelineYear key={tick.year} $mobile={!isDesktop} $axisPos={tick.axisPos}>
                            <YearDot $size={isDesktop ? 7 : 5} />
                            <YearLabel>{tick.year}</YearLabel>
                        </TimelineYear>
                    ))}
                    {personNodes.map((node) => {
                        const connector = isDesktop
                            ? { direction: 'vertical' as const, length: (node.row + 1) * CARD_STACK_DESKTOP }
                            : { direction: 'horizontal' as const, length: CARD_GAP + node.row * CARD_STACK_MOBILE };
                        return (
                            <React.Fragment key={node.id}>
                                <TimelineMarker $mobile={!isDesktop} $axisPos={node.axisPos} />
                                <DeathYearLabel $mobile={!isDesktop} $axisPos={node.axisPos}>
                                    {node.deathYear}
                                </DeathYearLabel>
                                <PersonNode
                                    variant="cemetery"
                                    person={node}
                                    row={node.row}
                                    axisPos={node.axisPos}
                                    isDesktop={isDesktop}
                                    highlighted={node.id === highlightId}
                                    connector={connector}
                                />
                            </React.Fragment>
                        );
                    })}
                </TimelineTrack>
            </ScrollViewport>
            <AddRelativeButton type="button" onClick={() => console.log('add relative')}>
                {t('addButton')}
            </AddRelativeButton>
        </CemeterySection>
    );
};

export default Cemetery;

