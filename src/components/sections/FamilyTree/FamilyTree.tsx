import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useSession } from '@/hooks/useSession';
import { useMedia } from '@/hooks/useMedia';
import {
    ApiError,
    addRelative as apiAddRelative,
    createPerson as apiCreatePerson,
    createRelation as apiCreateRelation,
    createTree as apiCreateTree,
    deletePerson as apiDeletePerson,
    deleteRelation as apiDeleteRelation,
    formatBackendError,
    getTreeSnapshot,
    listTrees as apiListTrees,
    RelativeKind,
    toBackendPersonInput,
    toLocalPerson,
    toLocalRelation,
    toLocalTree,
    updatePerson as apiUpdatePerson,
    updatePersonPreferences as apiUpdatePersonPreferences,
    updateTree as apiUpdateTree
} from '@/lib/api';
import type { PersonInput as LocalPersonInput } from '@/lib/family/storage';
import { AddRelativeKind, Person, PersonRelation, Tree } from '@/lib/family/types';
import {
    formatShortName,
    getParents,
    getSpouses,
    labelForRelation
} from '@/lib/family/relations';
import { DEFAULT_LAYOUT_OPTIONS, layoutTree, NodePosition } from '@/lib/family/layout';
 
import PersonNode from './PersonNode';
import Connections from './Connections';
import PersonContextMenu from './PersonContextMenu';
import TreeSidebar from './TreeSidebar';
import AddPersonModal, { AddPersonMode, AddPersonValues } from './AddPersonModal';
import AddRelativePicker from './AddRelativePicker';
import PersonCardModal, { PersonCardTab } from './PersonCardModal';
import {
    AddRelativeCta,
    Canvas,
    EmptyAvatar,
    EmptyCard,
    EmptyCta,
    EmptyOverlay,
    FloatingTopLeft,
    FloatingTopRight,
    IconButton,
    Scene,
    TreeImageLayer,
    TreeRoot,
    ZoomButton,
    ZoomControls,
    SearchPopover,
    SearchInput,
    SearchSubmit
} from './FamilyTree.styled';
 
interface ContextMenuState {
    person: Person;
    x: number;
    y: number;
}
 
interface RelativePickerState {
    person: Person;
}
 
interface CardState {
    personId: string;
    tab: PersonCardTab;
}
 
interface AddPersonState {
    mode: AddPersonMode;
}
 
const MIN_SCALE = 0.4;
const MAX_SCALE = 2.5;
 
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
 
const FamilyTree: React.FC = () => {
    const { t } = useTranslation('tree');
    const { session } = useSession();
 
    const [tick, setTick] = useState(0);
    const reload = useCallback(() => setTick((n) => n + 1), []);
    const [busy, setBusy] = useState(false);
    const [backendError, setBackendError] = useState('');
 
    const [trees, setTrees] = useState<Tree[]>([]);
    const [activeTreeId, setActiveTreeId] = useState<string>('');
    const [persons, setPersons] = useState<Person[]>([]);
    const [relations, setRelations] = useState<PersonRelation[]>([]);
 
    const [showHidden, setShowHidden] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [picker, setPicker] = useState<RelativePickerState | null>(null);
    const [addState, setAddState] = useState<AddPersonState | null>(null);
    const [card, setCard] = useState<CardState | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const isMobileViewport = useMedia('(max-width: 767px)', true);
 
    // Bootstrap: load (or create) the active tree for the signed-in user.
    useEffect(() => {
        if (!session) return;
        let cancelled = false;
        (async () => {
            try {
                const page = await apiListTrees(50, 0);
                let items = page.items;
                if (items.length === 0) {
                    const created = await apiCreateTree(t('defaultTreeName', { defaultValue: 'Tree 1' }));
                    items = [created];
                }
                if (cancelled) return;
                setTrees(items.map(toLocalTree));
                setActiveTreeId((current) =>
                    current && items.some((tr) => tr.id === current) ? current : items[0].id
                );
            } catch (error) {
                if (!cancelled) {
                    setBackendError(formatBackendError(error, t('errors.loadFailed', { defaultValue: 'Failed to load trees' })));
                }
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, tick]);
 
    useEffect(() => {
        if (!activeTreeId) {
            setPersons([]);
            setRelations([]);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const snapshot = await getTreeSnapshot(activeTreeId);
                if (cancelled) return;
                setPersons(snapshot.persons.map(toLocalPerson));
                setRelations(snapshot.relations.map(toLocalRelation));
                setTrees((prev) =>
                    prev.map((tr) => (tr.id === activeTreeId ? toLocalTree(snapshot.tree) : tr))
                );
            } catch (error) {
                if (!cancelled) {
                    setBackendError(formatBackendError(error, t('errors.loadFailed', { defaultValue: 'Failed to load tree' })));
                }
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTreeId, tick]);
 
    const activeTree = useMemo(() => trees.find((tr) => tr.id === activeTreeId) || null, [trees, activeTreeId]);
    const rootPerson = useMemo(
        () => (activeTree?.rootPersonId ? persons.find((p) => p.id === activeTree.rootPersonId) ?? null : null),
        [activeTree, persons]
    );
 
    // Pan + zoom state. (0,0) is the centre of the canvas.
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const dragState = useRef<{ pointerId: number; startX: number; startY: number; baseX: number; baseY: number } | null>(
        null
    );
    const canvasRef = useRef<HTMLDivElement>(null);
 
    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        if (event.target !== event.currentTarget) return;
        dragState.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            baseX: pan.x,
            baseY: pan.y
        };
        (event.target as Element).setPointerCapture?.(event.pointerId);
    };
 
    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragState.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        setPan({
            x: drag.baseX + (event.clientX - drag.startX),
            y: drag.baseY + (event.clientY - drag.startY)
        });
    };
 
    const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragState.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        dragState.current = null;
    };
 
    const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        const delta = -event.deltaY * 0.0015;
        setScale((current) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, current * (1 + delta))));
    };
 
    const zoomIn = () => setScale((current) => Math.min(MAX_SCALE, current * 1.15));
    const zoomOut = () => setScale((current) => Math.max(MIN_SCALE, current / 1.15));
    const recenter = () => {
        const nextScale = isMobileViewport ? 0.72 : 1;
        setScale(nextScale);
        if (layout) {
            setPan({
                x: -((layout.bounds.minX + layout.bounds.maxX) / 2) * nextScale,
                y: -((layout.bounds.minY + layout.bounds.maxY) / 2) * nextScale
            });
        } else {
            setPan({ x: 0, y: 0 });
        }
    };
 
    const layout = useMemo(() => {
        if (!rootPerson) return null;
        const visiblePersons = showHidden ? persons : persons.filter((p) => !p.isHidden);
        const visibleIds = new Set(visiblePersons.map((p) => p.id));
        const visibleRelations = relations.filter((r) => visibleIds.has(r.fromId) && visibleIds.has(r.toId));
        return layoutTree(rootPerson.id, visiblePersons, visibleRelations);
    }, [rootPerson, persons, relations, showHidden]);
 
    const nodeIndex = useMemo(() => {
        const map = new Map<string, NodePosition>();
        if (layout) layout.nodes.forEach((n) => map.set(n.personId, n));
        return map;
    }, [layout]);

    useEffect(() => {
        if (!layout) return;
        const nextScale = isMobileViewport ? 0.72 : 1;
        setScale(nextScale);
        setPan({
            x: -((layout.bounds.minX + layout.bounds.maxX) / 2) * nextScale,
            y: -((layout.bounds.minY + layout.bounds.maxY) / 2) * nextScale
        });
    }, [layout, isMobileViewport]);

    useEffect(() => {
        if (!searchOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSearchOpen(false);
                setSearchError('');
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [searchOpen]);

    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault();
        const normalized = searchQuery.trim().toLowerCase();
        if (!normalized) return;
        const match = persons.find((p) => formatShortName(p).toLowerCase().includes(normalized));
        if (!match) {
            setSearchError(t('controls.notFound', { defaultValue: 'Person not found' }));
            return;
        }
        const node = nodeIndex.get(match.id);
        if (node) {
            setPan({
                x: -(node.x + DEFAULT_LAYOUT_OPTIONS.nodeWidth / 2) * scale,
                y: -(node.y + DEFAULT_LAYOUT_OPTIONS.nodeHeight / 2) * scale
            });
        }
        setCard({ personId: match.id, tab: 'info' });
        setSearchOpen(false);
        setSearchQuery('');
        setSearchError('');
    };
 
    /* ---------------------- Mutations ---------------------- */
 
    const persistPersonBackend = async (treeId: string, input: LocalPersonInput): Promise<Person | null> => {
        try {
            const created = await apiCreatePerson(treeId, toBackendPersonInput(input));
            return toLocalPerson(created);
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save person' })));
            return null;
        }
    };
 
    const attachRelationBackend = async (
        treeId: string,
        type: PersonRelation['type'],
        fromId: string,
        toId: string,
        extras: Pick<PersonRelation, 'marriageDate' | 'divorceDate'> = {}
    ): Promise<boolean> => {
        try {
            await apiCreateRelation(treeId, {
                fromId,
                toId,
                type,
                marriageDate: extras.marriageDate ?? null,
                divorceDate: extras.divorceDate ?? null
            });
            return true;
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.relationFailed', { defaultValue: 'Failed to save relation' })));
            return false;
        }
    };
 
    const handleAddSelf = async (values: AddPersonValues) => {
        if (!session || !activeTreeId) return;
        setBusy(true);
        try {
            // setAsRoot: бэк сам назначает созданного человека корнем дерева.
            await apiCreatePerson(activeTreeId, { ...toBackendPersonInput(values), setAsRoot: true });
            setAddState(null);
            reload();
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save person' })));
        } finally {
            setBusy(false);
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
            await handleAddSelf(values);
            return;
        }
        if (mode.kind === 'edit') {
            setBusy(true);
            try {
                await apiUpdatePerson(mode.person.id, toBackendPersonInput(values));
                setAddState(null);
                reload();
            } catch (error) {
                setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save person' })));
            } finally {
                setBusy(false);
            }
            return;
        }
        // mode.kind === 'relative': atomic POST /relatives, fallback — person+relation.
        if (!activeTreeId) return;
        setBusy(true);
        setBackendError('');
        try {
            const relativeOf = mode.relativeOf;
            const kind = uiToRelativeKind(mode.relation);
            const parents = getParents(relativeOf.id, relations);
            const sharedParentIds = (() => {
                if (mode.relation !== 'brother' && mode.relation !== 'sister') return undefined;
                const requested = values.sharedParentIds;
                const shared = requested && requested.length > 0 ? requested.filter((id) => parents.includes(id)) : parents;
                return shared.length > 0 ? shared.slice(0, 2) : undefined;
            })();
            let atomicOk = false;
            try {
                await apiAddRelative(activeTreeId, {
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
                setPicker(null);
                reload();
                return;
            }
            const created = await persistPersonBackend(activeTreeId, { ...values, treeId: activeTreeId });
            if (!created) {
                setBusy(false);
                return;
            }
            const link = async (type: PersonRelation['type'], fromId: string, toId: string): Promise<void> => {
                const ok = await attachRelationBackend(activeTreeId, type, fromId, toId);
                if (!ok) {
                    throw new Error(t('errors.relationFailed', { defaultValue: 'Failed to save relation' }));
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
                const spouses = getSpouses(relativeOf.id, relations);
                if (spouses.length === 1) await link('parent', spouses[0], created.id);
                break;
            }
            case 'spouse':
                await link('spouse', relativeOf.id, created.id);
                break;
            case 'brother':
            case 'sister': {
                const siblingParents = getParents(relativeOf.id, relations);
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
        setPicker(null);
        reload();
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save person' })));
        } finally {
            setBusy(false);
        }
    };
 
    /**
     * Remove a single relation between `person` and `otherId`. Used by the
     * person card to let users clean up incorrect parent/spouse/sibling/child
     * links without cascade-deleting either person.
     */
    const handleRemoveRelation = async (
        person: Person,
        otherId: string,
        kind: 'parent' | 'spouse' | 'child' | 'sibling'
    ) => {
        const target = (() => {
            switch (kind) {
                case 'parent':
                    return relations.find(
                        (r) => r.type === 'parent' && r.fromId === otherId && r.toId === person.id
                    );
                case 'child':
                    return relations.find(
                        (r) => r.type === 'parent' && r.fromId === person.id && r.toId === otherId
                    );
                case 'spouse': {
                    const [a, b] = person.id < otherId ? [person.id, otherId] : [otherId, person.id];
                    return relations.find((r) => r.type === 'spouse' && r.fromId === a && r.toId === b);
                }
                case 'sibling': {
                    const [a, b] = person.id < otherId ? [person.id, otherId] : [otherId, person.id];
                    return relations.find((r) => r.type === 'sibling' && r.fromId === a && r.toId === b);
                }
            }
        })();
        if (!target) return;
        const confirmed =
            typeof window !== 'undefined'
                ? window.confirm(t('confirmRemoveRelation', { defaultValue: 'Remove this relation?' }))
                : true;
        if (!confirmed) return;
        try {
            await apiDeleteRelation(target.id);
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.deleteFailed', { defaultValue: 'Failed to delete' })));
        }
        reload();
    };
 
    const handleHideToggle = async (person: Person) => {
        try {
            await apiUpdatePersonPreferences(person.treeId, person.id, !person.isHidden);
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save' })));
        }
        setContextMenu(null);
        reload();
    };
 
    const handleDeletePerson = async (person: Person) => {
        const confirmed =
            typeof window !== 'undefined'
                ? window.confirm(t('confirmDelete', { defaultValue: 'Delete this person from the tree?' }))
                : true;
        if (!confirmed) return;
        try {
            await apiDeletePerson(person.id);
            if (activeTree?.rootPersonId === person.id) {
                await apiUpdateTree(person.treeId, { rootPersonId: null });
            }
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.deleteFailed', { defaultValue: 'Failed to delete' })));
        }
        setCard(null);
        setContextMenu(null);
        reload();
    };
 
    /* ---------------------- Sidebar handlers ---------------------- */
 
    const handleNewTree = async () => {
        if (!session) return;
        const name = window.prompt(t('sidebar.newTreePrompt', { defaultValue: 'Name of the new tree' }), `Tree ${trees.length + 1}`);
        if (!name) return;
        try {
            const tree = await apiCreateTree(name.trim());
            setActiveTreeId(tree.id);
            setSidebarOpen(false);
            reload();
        } catch (error) {
            setBackendError(formatBackendError(error, t('errors.saveFailed', { defaultValue: 'Failed to save' })));
        }
    };
 
    const placeholderAction = (key: string) => () => {
        if (typeof window !== 'undefined') {
            window.alert(t(`sidebar.placeholder.${key}` as const, { defaultValue: 'Coming soon' }));
        }
        setSidebarOpen(false);
    };
 
    /* ---------------------- Rendering helpers ---------------------- */
 
    const findPerson = (id: string): Person | undefined => persons.find((p) => p.id === id);
 
    const focusId = rootPerson?.id;
 
    const contextMenuPerson = contextMenu ? findPerson(contextMenu.person.id) ?? contextMenu.person : null;
    const cardPerson = card ? findPerson(card.personId) ?? null : null;
 
    const onClickNode = (person: Person, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setContextMenu({
            person,
            x: Math.min(rect.right + 12, (typeof window !== 'undefined' ? window.innerWidth : 1024) - 260),
            y: rect.top
        });
    };
 
    /* ---------------------- Empty state ---------------------- */
 
    if (!rootPerson) {
        return (
            <TreeRoot>
                <TreeImageLayer>
                    <Image
                        src="/images/fon.jpg"
                        alt="decorative tree"
                        fill
                        sizes="100vw"
                        loading="eager"
                        aria-hidden
                    />
                </TreeImageLayer>
                <FloatingTopRight>
                    <IconButton type="button" aria-label={t('controls.search', { defaultValue: 'Search' })} disabled>
                        <SearchIcon />
                    </IconButton>
                    <IconButton
                        type="button"
                        aria-label={t('controls.menu', { defaultValue: 'Menu' })}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <BurgerIcon />
                    </IconButton>
                </FloatingTopRight>
                <EmptyOverlay>
                    <EmptyCard
                        type="button"
                        onClick={() => setAddState({ mode: { kind: 'self' } })}
                        aria-label={t('emptyState.cta', { defaultValue: 'Add information about yourself' })}
                    >
                        <EmptyAvatar aria-hidden />
                        <span>{t('emptyState.title', { defaultValue: 'Add information about yourself' })}</span>
                    </EmptyCard>
                    <EmptyCta type="button" onClick={() => setAddState({ mode: { kind: 'self' } })}>
                        {t('emptyState.button', { defaultValue: 'Add information' })}
                    </EmptyCta>
                </EmptyOverlay>
 
                <TreeSidebar
                    open={sidebarOpen}
                    trees={trees.map((tr) => ({ id: tr.id, name: tr.name }))}
                    activeTreeId={activeTreeId}
                    onSelectTree={setActiveTreeId}
                    onClose={() => setSidebarOpen(false)}
                    onNewTree={handleNewTree}
                    onImportantDates={placeholderAction('importantDates')}
                    onGallery={placeholderAction('gallery')}
                    onInviteRelatives={placeholderAction('inviteRelatives')}
                    onDownloadForPrint={placeholderAction('downloadPrint')}
                    onContactUs={placeholderAction('contactUs')}
                />
 
                <AddPersonModal
                    open={Boolean(addState)}
                    mode={addState?.mode ?? { kind: 'self' }}
                    onCancel={() => setAddState(null)}
                    onSubmit={(values) => { void handleSavePersonBackend(values); }}
                />
            </TreeRoot>
        );
    }
 
    // Compute the focus person's parents for the half-sibling parent picker in
    // the AddPersonModal. Only relevant when adding a brother/sister, but the
    // modal will ignore the prop in every other mode.
    const addPersonFocusParents = (() => {
        const m = addState?.mode;
        if (!m || m.kind !== 'relative') return undefined;
        if (m.relation !== 'brother' && m.relation !== 'sister') return undefined;
        return getParents(m.relativeOf.id, relations)
            .map((id) => findPerson(id))
            .filter((p): p is Person => Boolean(p));
    })();
 
    /* ---------------------- Tree state ---------------------- */
 
    return (
        <TreeRoot>
            <TreeImageLayer>
                <Image
                    src="/images/fon.jpg"
                    alt="decorative tree"
                    fill
                    sizes="100vw"
                    loading="eager"
                    aria-hidden
                />
            </TreeImageLayer>
 
            <Canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={stopDrag}
                onPointerCancel={stopDrag}
                onWheel={onWheel}
            >
                <Scene $x={pan.x} $y={pan.y} $scale={scale}>
                    {layout && <Connections segments={layout.connections} bounds={layout.bounds} />}
                    {layout?.nodes.map((node) => {
                        const person = findPerson(node.personId);
                        if (!person) return null;
                        const label = labelForRelation(person, focusId, relations, t);
                        return (
                            <PersonNode
                                key={person.id}
                                person={person}
                                x={node.x}
                                y={node.y}
                                width={DEFAULT_LAYOUT_OPTIONS.nodeWidth}
                                height={DEFAULT_LAYOUT_OPTIONS.nodeHeight}
                                relationLabel={label}
                                isHidden={person.isHidden}
                                onClick={(event) => onClickNode(person, event)}
                            />
                        );
                    })}
                </Scene>
            </Canvas>
 
            <FloatingTopLeft>
                <IconButton
                    type="button"
                    aria-label={t('controls.search', { defaultValue: 'Search' })}
                    onClick={() => { setSearchOpen((value) => !value); setSearchError(''); }}
                >
                    <SearchIcon />
                </IconButton>
            </FloatingTopLeft>

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
 
            <FloatingTopRight>
                <IconButton
                    type="button"
                    aria-label={t('controls.menu', { defaultValue: 'Menu' })}
                    onClick={() => setSidebarOpen(true)}
                >
                    <BurgerIcon />
                </IconButton>
            </FloatingTopRight>

            {(busy) && (
                <SearchPopover aria-label={t('controls.loading', { defaultValue: 'Loading' })}>
                    <span role="status">{t('controls.loading', { defaultValue: 'Loading…' })}</span>
                </SearchPopover>
            )}
            {backendError && (
                <SearchPopover aria-label={t('controls.error', { defaultValue: 'Error' })}>
                    <span role="alert">{backendError}</span>
                    <SearchSubmit type="button" onClick={() => { setBackendError(''); reload(); }}>
                        {t('controls.retry', { defaultValue: 'Retry' })}
                    </SearchSubmit>
                </SearchPopover>
            )}
 
            <ZoomControls>
                <ZoomButton type="button" aria-label="zoom in" onClick={zoomIn}>
                    +
                </ZoomButton>
                <ZoomButton type="button" aria-label="zoom out" onClick={zoomOut}>
                    −
                </ZoomButton>
                <ZoomButton type="button" aria-label="reset" onClick={recenter}>
                    ◎
                </ZoomButton>
            </ZoomControls>
 
            <AddRelativeCta type="button" onClick={() => rootPerson && setPicker({ person: rootPerson })}>
                {t('addRelativeCta', { defaultValue: 'Add a relative' })}
            </AddRelativeCta>
 
            {contextMenu && contextMenuPerson && (
                <PersonContextMenu
                    person={contextMenuPerson}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    showHiddenRelatives={showHidden}
                    canDelete={contextMenuPerson.id !== focusId}
                    onClose={() => setContextMenu(null)}
                    onOpenCard={() => {
                        setCard({ personId: contextMenuPerson.id, tab: 'info' });
                        setContextMenu(null);
                    }}
                    onEditCard={() => {
                        setAddState({ mode: { kind: 'edit', person: contextMenuPerson } });
                        setContextMenu(null);
                    }}
                    onAddRelative={() => {
                        setPicker({ person: contextMenuPerson });
                        setContextMenu(null);
                    }}
                    onViewRelations={() => {
                        setCard({ personId: contextMenuPerson.id, tab: 'parents' });
                        setContextMenu(null);
                    }}
                    onToggleHidden={() => { void handleHideToggle(contextMenuPerson); }}
                    onToggleShowHidden={() => {
                        setShowHidden((v) => !v);
                        setContextMenu(null);
                    }}
                    onDelete={() => { void handleDeletePerson(contextMenuPerson); }}
                />
            )}
 
            <AddRelativePicker
                open={Boolean(picker)}
                person={picker?.person ?? null}
                onCancel={() => setPicker(null)}
                onPick={(kind) => {
                    if (!picker) return;
                    setAddState({ mode: { kind: 'relative', relativeOf: picker.person, relation: kind } });
                    setPicker(null);
                }}
            />
 
            <AddPersonModal
                open={Boolean(addState)}
                mode={addState?.mode ?? { kind: 'self' }}
                focusParents={addPersonFocusParents}
                onCancel={() => setAddState(null)}
                onSubmit={(values) => { void handleSavePersonBackend(values); }}
            />
 
            <PersonCardModal
                open={Boolean(card)}
                person={cardPerson}
                persons={persons}
                relations={relations}
                initialTab={card?.tab ?? 'info'}
                onClose={() => setCard(null)}
                onEdit={(person) => {
                    setAddState({ mode: { kind: 'edit', person } });
                    setCard(null);
                }}
                onSelectPerson={(id) => setCard({ personId: id, tab: 'info' })}
                onAddParent={(person) => {
                    const kind: AddRelativeKind = person.gender === 'male' ? 'father' : 'mother';
                    setAddState({ mode: { kind: 'relative', relativeOf: person, relation: kind } });
                }}
                onAddSpouse={(person) => {
                    setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'spouse' } });
                }}
                onAddChild={(person) => {
                    setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'daughter' } });
                }}
                onAddSibling={(person) => {
                    setAddState({ mode: { kind: 'relative', relativeOf: person, relation: 'sister' } });
                }}
 
                onRemoveRelation={(person, relativeId, kind) => { void handleRemoveRelation(person, relativeId, kind); }}
            />
 
            <TreeSidebar
                open={sidebarOpen}
                trees={trees.map((tr) => ({ id: tr.id, name: tr.name }))}
                activeTreeId={activeTreeId}
                onSelectTree={(id) => {
                    setActiveTreeId(id);
                    setSidebarOpen(false);
                }}
                onClose={() => setSidebarOpen(false)}
                onNewTree={handleNewTree}
                onImportantDates={placeholderAction('importantDates')}
                onGallery={placeholderAction('gallery')}
                onInviteRelatives={placeholderAction('inviteRelatives')}
                onDownloadForPrint={placeholderAction('downloadPrint')}
                onContactUs={placeholderAction('contactUs')}
            />
 
        </TreeRoot>
    );
};
 
export default FamilyTree;
