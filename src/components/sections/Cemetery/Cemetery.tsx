'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useSetRecoilState } from 'recoil';
import { SandwichState } from '@/recoil/sandwichState/athom';
import { useSession } from '@/hooks/useSession';
import {
    addRelative as apiAddRelative,
    ApiError,
    createPerson as apiCreatePerson,
    createRelation as apiCreateRelation,
    createTree as apiCreateTree,
    deleteRelation as apiDeleteRelation,
    formatBackendError,
    listTrees as apiListTrees,
    RelativeKind,
    toBackendPersonInput,
    toLocalPerson,
    updatePerson as apiUpdatePerson,
    updateTree as apiUpdateTree
} from '@/lib/api';
import { getParents, getSpouses, labelForRelation } from '@/lib/family/relations';
import { AddRelativeKind, Person, PersonRelation } from '@/lib/family/types';
import type { PersonInput as LocalPersonInput } from '@/lib/family/storage';
import {
    AddRelativeButton,
    CemeterySection,
    FloatingIconButton,
    FloatingTopRight,
    PageBackground,
    ScrollViewport,
    TimelineLine,
    TimelineTrack,
    TimelineYear,
    YearDot,
    YearLabel,
    TimelineMarker,
    DeathYearLabel,
    SearchPopover,
    SearchInput,
    SearchSubmit
} from './Cemetery.styled';
import PeriodNavigation from './PeriodNavigation';
import PersonNode from '../FamilyTree/PersonNode';
import PersonCardModal, { PersonCardTab } from '../FamilyTree/PersonCardModal';
import AddPersonModal, { AddPersonMode, AddPersonValues } from '../FamilyTree/AddPersonModal';
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
    buildDeathWindows,
    parsePersons
} from './cemeteryUtils';
import { useMedia } from '@/hooks/useMedia';
import useSmoothScrollX from '@/hooks/useSmoothScrollX';
import CemeteryAddPersonModal, { type CemeteryPersonValues } from './CemeteryAddPersonModal';

export interface CemeteryProps {
    periods?: CemeteryPeriod[];
    persons?: CemeteryPerson[];
}

interface AddPersonState {
    mode: AddPersonMode;
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
    const [addPersonOpen, setAddPersonOpen] = useState(false);
    const [addPersonError, setAddPersonError] = useState('');
    const [card, setCard] = useState<{ personId: string; tab: PersonCardTab } | null>(null);
    const [addState, setAddState] = useState<AddPersonState | null>(null);
    const [backendError, setBackendError] = useState('');

    const reloadFamily = React.useCallback(() => {
        if (!session) return;
        (async () => {
            try {
                const { listTrees, getTreeSnapshot, toLocalPerson, toLocalRelation } = await import('@/lib/api');
                const page = await listTrees(50, 0);
                const tree = page.items[0];
                if (!tree) {
                    setFamilyPersons([]);
                    setFamilyRelations([]);
                    setFocusId(undefined);
                    return;
                }
                const snapshot = await getTreeSnapshot(tree.id);
                setFamilyPersons(snapshot.persons.map(toLocalPerson));
                setFamilyRelations(snapshot.relations.map(toLocalRelation));
                setFocusId(snapshot.tree.rootPersonId ?? undefined);
            } catch {
                // Тихо оставляем демо-данные при ошибке бэка.
            }
        })();
    }, [session]);

    useEffect(() => {
        if (!session) {
            setFamilyPersons(null);
            setFamilyRelations([]);
            setFocusId(undefined);
            return;
        }
        reloadFamily();
    }, [session, reloadFamily]);

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

    // Periods are 100-year windows derived from the dead relatives themselves:
    // only windows containing a death are shown, snapped to century boundaries,
    // always at least one full window (100 years). This keeps the line short —
    // and the scroll fast — instead of the old fixed 1700–2026 span with three
    // empty centuries to crawl through.
    const periods = useMemo(
        () => periodsProp ?? buildDeathWindows(allPersons, new Date().getFullYear()),
        [periodsProp, allPersons]
    );

    const isDesktop = useMedia('(min-width: 768px)', false);

    // Inner size of the scroll viewport (width on desktop, height on mobile),
    // measured so the track can be stretched to fill at least 100% of it.
    const [viewportExtent, setViewportExtent] = useState(0);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const frameRef = useRef<number | null>(null);
    const programmaticScrollRef = useRef(false);

    const startYear = periods[0]?.startYear ?? 1700;
    const endYear = periods[periods.length - 1]?.endYear ?? 2026;
    const totalYears = endYear - startYear;

    // Stretch the per-year density so the whole track is at least as long as the
    // visible window (100% width/height), but never denser than the design's
    // reference scale for longer spans.
    const basePixelsPerYear = isDesktop ? PIXELS_PER_YEAR_DESKTOP : PIXELS_PER_YEAR_MOBILE;
    const pixelsPerYear = useMemo(() => {
        if (totalYears <= 0) return basePixelsPerYear;
        const fit = (viewportExtent - 2 * TRACK_PADDING) / totalYears;
        return Math.max(basePixelsPerYear, fit);
    }, [basePixelsPerYear, viewportExtent, totalYears]);

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

    const handleAddPerson = async (values: CemeteryPersonValues) => {
        if (!session) {
            setAddPersonError(t('form.errors.signInRequired', { defaultValue: 'Sign in to save information' }));
            return;
        }

        try {
            const page = await apiListTrees(50, 0);
            let tree = page.items[0];
            if (!tree) {
                tree = await apiCreateTree(tTree('defaultTreeName', { defaultValue: 'Tree 1' }));
            }

            const isRoot = !tree.rootPersonId;
            const created = await apiCreatePerson(
                tree.id,
                toBackendPersonInput({
                    gender: values.gender,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    middleName: values.middleName,
                    maidenName: values.maidenName,
                    birthDate: values.birthDate,
                    birthPlace: values.birthPlace,
                    deathDate: values.deathDate,
                    deathPlace: values.deathPlace,
                    biography: values.biography,
                    photo: values.photo || values.memorialPhoto
                })
            );
            if (isRoot) {
                await apiUpdateTree(tree.id, { rootPersonId: created.id });
            }

            reloadFamily();
            setAddPersonError('');
            setAddPersonOpen(false);
        } catch (error) {
            setAddPersonError(formatBackendError(error, t('form.errors.saveFailed', { defaultValue: 'Failed to save person' })));
        }
    };

    /* ---------------------- Mutations ---------------------- */

    /** Resolve the current user's active tree, creating one if needed. */
    const getActiveTreeId = async (): Promise<string | null> => {
        if (!session) return null;
        try {
            const page = await apiListTrees(50, 0);
            let tree = page.items[0];
            if (!tree) {
                tree = await apiCreateTree(tTree('defaultTreeName', { defaultValue: 'Tree 1' }));
            }
            return tree.id;
        } catch {
            return null;
        }
    };

    const persistPersonBackend = async (treeId: string, input: LocalPersonInput): Promise<Person | null> => {
        try {
            const created = await apiCreatePerson(treeId, toBackendPersonInput(input));
            return toLocalPerson(created);
        } catch (error) {
            setBackendError(formatBackendError(error, tTree('errors.saveFailed', { defaultValue: 'Failed to save person' })));
            return null;
        }
    };

    const attachRelationBackend = async (
        treeId: string,
        type: PersonRelation['type'],
        fromId: string,
        toId: string
    ): Promise<boolean> => {
        try {
            await apiCreateRelation(treeId, { fromId, toId, type, marriageDate: null, divorceDate: null });
            return true;
        } catch (error) {
            setBackendError(formatBackendError(error, tTree('errors.relationFailed', { defaultValue: 'Failed to save relation' })));
            return false;
        }
    };

    const uiToRelativeKind = (relation: string): RelativeKind => {
        switch (relation) {
            case 'mother': return 'mother';
            case 'father': return 'father';
            case 'spouse': return 'spouse';
            case 'son': return 'son';
            case 'daughter': return 'daughter';
            case 'brother': return 'brother';
            case 'sister': return 'sister';
            default: return 'sibling';
        }
    };

    const handleSavePersonBackend = async (values: AddPersonValues) => {
        if (!addState) return;
        const mode = addState.mode;
        if (mode.kind === 'self') {
            // Self mode is handled by CemeteryAddPersonModal; fallthrough here.
            return;
        }
        if (mode.kind === 'edit') {
            try {
                await apiUpdatePerson(mode.person.id, toBackendPersonInput(values));
                setAddState(null);
                reloadFamily();
            } catch (error) {
                setBackendError(formatBackendError(error, tTree('errors.saveFailed', { defaultValue: 'Failed to save person' })));
            }
            return;
        }
        // mode.kind === 'relative': atomic POST /relatives, fallback — person+relation.
        const treeId = await getActiveTreeId();
        if (!treeId) return;
        setBackendError('');
        try {
            const relativeOf = mode.relativeOf;
            const kind = uiToRelativeKind(mode.relation);
            const parents = getParents(relativeOf.id, familyRelations);
            const sharedParentIds = (() => {
                if (mode.relation !== 'brother' && mode.relation !== 'sister') return undefined;
                const requested = values.sharedParentIds;
                const shared = requested && requested.length > 0 ? requested.filter((id) => parents.includes(id)) : parents;
                return shared.length > 0 ? shared.slice(0, 2) : undefined;
            })();
            let atomicOk = false;
            try {
                await apiAddRelative(treeId, {
                    relativeOfId: relativeOf.id,
                    kind,
                    person: toBackendPersonInput(values),
                    ...(sharedParentIds ? { sharedParentIds } : {})
                });
                atomicOk = true;
            } catch (error) {
                if (!(error instanceof ApiError) || (error.status !== 400 && error.status !== 409 && error.status !== 422)) throw error;
            }
            if (atomicOk) {
                setAddState(null);
                reloadFamily();
                return;
            }
            const created = await persistPersonBackend(treeId, { ...values, treeId });
            if (!created) {
                return;
            }
            const link = async (type: PersonRelation['type'], fromId: string, toId: string): Promise<void> => {
                const ok = await attachRelationBackend(treeId, type, fromId, toId);
                if (!ok) {
                    throw new Error(tTree('errors.relationFailed', { defaultValue: 'Failed to save relation' }));
                }
            };

            switch (mode.relation) {
                case 'mother':
                case 'father':
                    await link('parent', created.id, relativeOf.id);
                    break;
                case 'son':
                case 'daughter': {
                    await link('parent', relativeOf.id, created.id);
                    const spouses = getSpouses(relativeOf.id, familyRelations);
                    if (spouses.length === 1) await link('parent', spouses[0], created.id);
                    break;
                }
                case 'spouse':
                    await link('spouse', relativeOf.id, created.id);
                    break;
                case 'brother':
                case 'sister': {
                    const siblingParents = getParents(relativeOf.id, familyRelations);
                    if (siblingParents.length > 0) {
                        const requested = values.sharedParentIds;
                        const shared = requested && requested.length > 0 ? requested.filter((id) => siblingParents.includes(id)) : siblingParents;
                        if (shared.length > 0) {
                            for (const parentId of shared) await link('parent', parentId, created.id);
                        } else {
                            await link('sibling', relativeOf.id, created.id);
                        }
                    } else {
                        await link('sibling', relativeOf.id, created.id);
                    }
                    break;
                }
            }
            setAddState(null);
            reloadFamily();
        } catch (error) {
            setBackendError(formatBackendError(error, tTree('errors.saveFailed', { defaultValue: 'Failed to save person' })));
        }
    };

    // Search over the memorial cards currently rendered on the timeline.
    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        const normalized = searchQuery.trim().toLowerCase();
        if (!normalized) return;
        const node = personNodes.find((n) => formatPersonName(n).toLowerCase().includes(normalized));
        if (!node) {
            setSearchError(t('controls.notFound', { defaultValue: 'Person not found' }));
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
        setSearchOpen(false);
        setSearchQuery('');
        setSearchError('');
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

    useEffect(() => {
        if (activeId || periods.length === 0) return;
        setActiveId(periods[periods.length - 1].id);
    }, [activeId, periods]);

    useEffect(() => {
        if (isDesktop || !viewportRef.current || personNodes.length === 0) return;
        const viewport = viewportRef.current;
        const frame = window.requestAnimationFrame(() => {
            viewport.scrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        });
        return () => window.cancelAnimationFrame(frame);
    }, [isDesktop, personNodes.length, trackHeight]);

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

    // Measure the viewport so the track can be stretched to fill it. A
    // ResizeObserver also catches the scrollbar-gutter and breakpoint changes,
    // not just window resizes.
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const measure = () => setViewportExtent(isDesktop ? el.clientWidth : el.clientHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [isDesktop]);

    // Desktop: vertical mouse-wheel drives the horizontal timeline with the
    // project's inertial (GSAP-ticker lerp) smooth-scroll — the same feel as the
    // page-level useSmoothScroll, applied to the track's own scrollLeft. Enabled
    // only for the horizontal (desktop) layout; the vertical mobile layout keeps
    // native scrolling.
    useSmoothScrollX(viewportRef, { enabled: isDesktop, speed: 1.2 });

    return (
        <CemeterySection>
            <PageBackground aria-hidden="true">
                <Image
                    src="/images/cemetery/cemetery-bg-fhd.jpg"
                    fill
                    alt=""
                    quality={100}
                    sizes="100vw"
                />
            </PageBackground>
            {searchOpen && (
                <SearchPopover onSubmit={submitSearch} aria-label={t('controls.search', { defaultValue: 'Search' })}>
                    <SearchInput
                        autoFocus
                        type="search"
                        aria-label={t('controls.searchPrompt', { defaultValue: 'Search by name' })}
                        placeholder={t('controls.searchPrompt', { defaultValue: 'Search by name' })}
                        value={searchQuery}
                        onChange={(event) => { setSearchQuery(event.target.value); setSearchError(''); }}
                    />
                    <SearchSubmit type="submit">{t('controls.search', { defaultValue: 'Search' })}</SearchSubmit>
                    {searchError && <span role="alert">{searchError}</span>}
                </SearchPopover>
            )}
            {backendError && (
                <SearchPopover aria-label={t('controls.error', { defaultValue: 'Error' })}>
                    <span role="alert">{backendError}</span>
                    <SearchSubmit type="button" onClick={() => { setBackendError(''); reloadFamily(); }}>
                        {t('controls.retry', { defaultValue: 'Retry' })}
                    </SearchSubmit>
                </SearchPopover>
            )}
            <FloatingTopRight>
                <FloatingIconButton
                    type="button"
                    aria-label={t('controls.search', { defaultValue: 'Search' })}
                    onClick={() => { setSearchOpen((value) => !value); setSearchError(''); }}
                >
                    <SearchIcon />
                </FloatingIconButton>
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
                                    onClick={() => setCard({ personId: node.id, tab: 'info' })}
                                />
                            </React.Fragment>
                        );
                    })}
                </TimelineTrack>
            </ScrollViewport>
            <AddRelativeButton
                type="button"
                onClick={() => {
                    setAddPersonError('');
                    setAddPersonOpen(true);
                }}
            >
                {t('addButton')}
            </AddRelativeButton>
            <CemeteryAddPersonModal
                open={addPersonOpen}
                submitError={addPersonError}
                onCancel={() => {
                    setAddPersonError('');
                    setAddPersonOpen(false);
                }}
                onSubmit={handleAddPerson}
            />

            {/*
                Person card modal — mirrors the tree page flow. Only available for
                signed-in users where we have the full `Person` objects in
                `familyPersons`; anonymous visitors see the demo timeline without
                the ability to open full cards (their data is the slim
                `CemeteryPerson` type).
            */}
            {familyPersons && card && (() => {
                const fullPerson = familyPersons.find((p) => p.id === card.personId);
                if (!fullPerson) return null;
                return (
                    <PersonCardModal
                        open={true}
                        variant="cemetery"
                        person={fullPerson}
                        persons={familyPersons}
                        relations={familyRelations}
                        initialTab={card.tab}
                        onClose={() => setCard(null)}
                        onEdit={(person) => {
                            setAddState({ mode: { kind: 'edit', person } });
                            setCard(null);
                        }}
                        onSelectPerson={(id) => setCard({ personId: id, tab: 'info' })}
                        onAddParent={(person) => {
                            const kind: AddRelativeKind = person.gender === 'male' ? 'father' : 'mother';
                            setAddState({ mode: { kind: 'relative', relativeOf: person, relation: kind } });
                            setCard(null);
                        }}
                        onAddSpouse={(person) => {
                            setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'spouse' } });
                            setCard(null);
                        }}
                        onAddChild={(person) => {
                            setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'daughter' } });
                            setCard(null);
                        }}
                        onAddSibling={(person) => {
                            setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'sister' } });
                            setCard(null);
                        }}
                        onRemoveRelation={async (person, relativeId, kind) => {
                    // Reuse the tree page's relation-removal logic via a confirmation prompt.
                    const confirmed =
                        typeof window !== 'undefined'
                            ? window.confirm('Remove this relation?')
                            : true;
                    if (!confirmed) return;
                    try {
                        // Find the matching relation edge to delete.
                        const target = (() => {
                            switch (kind) {
                                case 'parent':
                                    return familyRelations.find(
                                        (r) => r.type === 'parent' && r.fromId === relativeId && r.toId === person.id
                                    );
                                case 'child':
                                    return familyRelations.find(
                                        (r) => r.type === 'parent' && r.fromId === person.id && r.toId === relativeId
                                    );
                                case 'spouse': {
                                    const [a, b] = person.id < relativeId ? [person.id, relativeId] : [relativeId, person.id];
                                    return familyRelations.find((r) => r.type === 'spouse' && r.fromId === a && r.toId === b);
                                }
                                case 'sibling': {
                                    const [a, b] = person.id < relativeId ? [person.id, relativeId] : [relativeId, person.id];
                                    return familyRelations.find((r) => r.type === 'sibling' && r.fromId === a && r.toId === b);
                                }
                                default:
                                    return undefined;
                            }
                        })();
                        if (!target) return;
                        await apiDeleteRelation(target.id);
                    } catch {
                        // Silently handle — user can retry.
                    }
                    reloadFamily();
                }}
                    />
                );
            })()}

            <AddPersonModal
                open={Boolean(addState)}
                variant="cemetery"
                mode={addState?.mode ?? { kind: 'self' }}
                onCancel={() => setAddState(null)}
                onSubmit={(values) => { void handleSavePersonBackend(values); }}
            />
        </CemeterySection>
    );
};

export default Cemetery;

