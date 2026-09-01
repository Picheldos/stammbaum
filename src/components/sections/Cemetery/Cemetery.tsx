'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
    AddRelativeButton,
    CemeterySection,
    PageBackground,
    ScrollViewport,
    TimelineLine,
    TimelineTrack,
    TimelineYear,
    YearDot,
    YearLabel
} from './Cemetery.styled';
import PeriodNavigation from './PeriodNavigation';
import CemeteryPersonCard from './CemeteryPersonCard';
import type { CemeteryPeriod, CemeteryPerson } from './Cemetery.types';
import {
    CARD_GAP,
    CARD_HEIGHT_DESKTOP,
    CARD_HEIGHT_MOBILE,
    CARD_STACK_DESKTOP,
    CARD_STACK_MOBILE,
    findPeriodForYear,
    TIMELINE_AXIS_LEFT,
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

/** Main orchestrator for the Virtual Cemetery timeline. */
const Cemetery: React.FC<CemeteryProps> = ({ periods: periodsProp, persons: personsProp }) => {
    const { t } = useTranslation('cemetery');
    const viewportRef = useRef<HTMLDivElement>(null);

    const periods = useMemo(
        () => parsePeriods(periodsProp ?? t('periods', { returnObjects: true })),
        [periodsProp, t]
    );
    const allPersons = useMemo(
        () => parsePersons(personsProp ?? t('persons', { returnObjects: true })),
        [personsProp, t]
    );

    const isDesktop = useMedia('(min-width: 768px)', false);
    const pixelsPerYear = isDesktop ? PIXELS_PER_YEAR_DESKTOP : PIXELS_PER_YEAR_MOBILE;

    const [activeId, setActiveId] = useState<string | null>(null);
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
    const trackStyle: React.CSSProperties = isDesktop
        ? { width: trackWidth, height: trackHeight }
        : { height: trackHeight };

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
            <PageBackground aria-hidden="true" />
            <PeriodNavigation periods={periods} activeId={activeId} onPeriodClick={handlePeriodClick} />
            <ScrollViewport ref={viewportRef}>
                <TimelineTrack style={trackStyle}>
                    <TimelineLine $mobile={!isDesktop} />
                    {yearTicks.map((tick) => (
                        <TimelineYear key={tick.year} $mobile={!isDesktop} $axisPos={tick.axisPos}>
                            <YearDot $size={isDesktop ? 7 : 5} />
                            <YearLabel>{tick.year}</YearLabel>
                        </TimelineYear>
                    ))}
                    {personNodes.map((node) => {
                        // `top`/`bottom` are neutralized so inline styles from the
                        // other breakpoint never conflict with the CSS layout.
                        const anchorStyle: React.CSSProperties = isDesktop
                            ? {
                                  top: 'auto',
                                  left: node.axisPos,
                                  bottom: LINE_BOTTOM_OFFSET + (node.row + 1) * CARD_STACK_DESKTOP
                              }
                            : {
                                  bottom: 'auto',
                                  top: node.axisPos,
                                  left: `calc(${TIMELINE_AXIS_LEFT}px + ${CARD_GAP}px + ${node.row * CARD_STACK_MOBILE}px)`,
                                  transform: 'translateY(-50%)'
                              };
                        const connector = isDesktop
                            ? { direction: 'vertical' as const, length: (node.row + 1) * CARD_STACK_DESKTOP }
                            : { direction: 'horizontal' as const, length: CARD_GAP + node.row * CARD_STACK_MOBILE };
                        return (
                            <CemeteryPersonCard
                                key={node.id}
                                person={node}
                                anchorStyle={anchorStyle}
                                connector={connector}
                            />
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

