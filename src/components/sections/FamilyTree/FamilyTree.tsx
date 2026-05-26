import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useSession } from '@/hooks/useSession';
import {
    addRelation,
    createPerson,
    createTree,
    listPersons,
    listRelations,
    listTrees,
    PersonInput,
    removePerson,
    removeRelation, 
    setPersonHidden,
    updatePerson,
    updateTree,
    upsertUserPerson
} from '@/lib/family/storage';
import { AddRelativeKind, Person, PersonRelation, Tree } from '@/lib/family/types';
import {
    formatShortName,
    getChildren,
    getParents,
    getSiblings,
    getSpouses
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
    ZoomControls
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
 
const labelForRelation = (
    person: Person,
    focusId: string | undefined,
    relations: PersonRelation[],
    t: (key: string, opts?: { defaultValue?: string }) => string
): string | undefined => {
    if (!focusId) return undefined;
    if (person.id === focusId) return t('relativeLabel.self', { defaultValue: 'Me' });
 
    const parents = getParents(focusId, relations);
    if (parents.includes(person.id)) {
        return person.gender === 'male'
            ? t('relativeLabel.father', { defaultValue: 'Father' })
            : t('relativeLabel.mother', { defaultValue: 'Mother' });
    }
    const children = getChildren(focusId, relations);
    if (children.includes(person.id)) {
        return person.gender === 'male'
            ? t('relativeLabel.son', { defaultValue: 'Son' })
            : t('relativeLabel.daughter', { defaultValue: 'Daughter' });
    }
    const spouses = getSpouses(focusId, relations);
    if (spouses.includes(person.id)) {
        return person.gender === 'male'
            ? t('relativeLabel.husband', { defaultValue: 'Husband' })
            : t('relativeLabel.wife', { defaultValue: 'Wife' });
    }
    const siblings = getSiblings(focusId, relations);
    if (siblings.includes(person.id)) {
        return person.gender === 'male'
            ? t('relativeLabel.brother', { defaultValue: 'Brother' })
            : t('relativeLabel.sister', { defaultValue: 'Sister' });
    }
 
    // Grandparents
    for (const parentId of parents) {
        const grand = getParents(parentId, relations);
        if (grand.includes(person.id)) {
            return person.gender === 'male'
                ? t('relativeLabel.grandfather', { defaultValue: 'Grandfather' })
                : t('relativeLabel.grandmother', { defaultValue: 'Grandmother' });
        }
        const auntsUncles = getSiblings(parentId, relations);
        if (auntsUncles.includes(person.id)) {
            return person.gender === 'male'
                ? t('relativeLabel.uncle', { defaultValue: 'Uncle' })
                : t('relativeLabel.aunt', { defaultValue: 'Aunt' });
        }
    }
 
    // Grandchildren
    for (const childId of children) {
        const grand = getChildren(childId, relations);
        if (grand.includes(person.id)) {
            return person.gender === 'male'
                ? t('relativeLabel.grandson', { defaultValue: 'Grandson' })
                : t('relativeLabel.granddaughter', { defaultValue: 'Granddaughter' });
        }
    }
 
    return t('relativeLabel.relative', { defaultValue: 'Relative' });
};
 
const FamilyTree: React.FC = () => {
    const { t } = useTranslation('tree');
    const { session } = useSession();
 
    const [tick, setTick] = useState(0);
    const reload = useCallback(() => setTick((n) => n + 1), []);
 
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
 
    // Bootstrap: load (or create) the active tree for the signed-in user.
    useEffect(() => {
        if (!session) return;
        let userTrees = listTrees(session.username);
        if (userTrees.length === 0) {
            createTree(session.username, t('defaultTreeName', { defaultValue: 'Tree 1' }));
            userTrees = listTrees(session.username);
        }
        setTrees(userTrees);
        setActiveTreeId((current) => (current && userTrees.some((tr) => tr.id === current) ? current : userTrees[0].id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, tick]);
 
    useEffect(() => {
        if (!activeTreeId) {
            setPersons([]);
            setRelations([]);
            return;
        }
        setPersons(listPersons(activeTreeId));
        setRelations(listRelations(activeTreeId));
    }, [activeTreeId, tick]);
 
    const activeTree = useMemo(() => trees.find((tr) => tr.id === activeTreeId) || null, [trees, activeTreeId]);
    const rootPerson = useMemo(
        () => (activeTree?.rootPersonId ? persons.find((p) => p.id === activeTree.rootPersonId) ?? null : null),
        [activeTree, persons]
    );
 
    // Pan + zoom state. (0,0) is the centre of the canvas.
    const [scale, setScale] = useState(1.5);
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
        setScale(1);
        setPan({ x: 0, y: 0 });
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
 
    /* ---------------------- Mutations ---------------------- */
 
    const persistPerson = (input: PersonInput): Person => {
        const person = createPerson(input);
        reload();
        return person;
    };
 
    const attachRelation = (
        type: PersonRelation['type'],
        fromId: string,
        toId: string,
        extras: Pick<PersonRelation, 'marriageDate' | 'divorceDate'> = {}
    ) => {
        if (!activeTreeId) return;
        addRelation(activeTreeId, type, fromId, toId, extras);
    };
 
    const handleAddSelf = (values: AddPersonValues) => {
        if (!session || !activeTreeId) return;
        const person = persistPerson({ ...values, treeId: activeTreeId });
        updateTree(activeTreeId, { rootPersonId: person.id });
        upsertUserPerson({
            userId: session.username,
            treeId: activeTreeId,
            personId: person.id,
            isOwner: true,
            isRoot: true,
            isHidden: false,
            canEdit: true
        });
        setAddState(null);
        reload();
    };
 
    const handleSavePerson = (values: AddPersonValues) => {
        if (!addState) return;
        const mode = addState.mode;
        if (mode.kind === 'self') {
            handleAddSelf(values);
            return;
        }
        if (mode.kind === 'edit') {
            updatePerson(mode.person.id, { ...values, treeId: mode.person.treeId });
            setAddState(null);
            reload();
            return;
        }
        // mode.kind === 'relative'
        if (!activeTreeId) return;
        const relativeOf = mode.relativeOf;
        const created = persistPerson({ ...values, treeId: activeTreeId });
 
        switch (mode.relation) {
            case 'mother':
            case 'father':
                attachRelation('parent', created.id, relativeOf.id);
                break;
            case 'son':
            case 'daughter': {
                attachRelation('parent', relativeOf.id, created.id);
                // If the focused person has a single spouse, attach that spouse as a co-parent too.
                const spouses = getSpouses(relativeOf.id, relations);
                if (spouses.length === 1) attachRelation('parent', spouses[0], created.id);
                break;
            }
            case 'spouse':
                attachRelation('spouse', relativeOf.id, created.id);
                break;
            case 'brother':
            case 'sister': {
                const parents = getParents(relativeOf.id, relations);
                if (parents.length > 0) {
                    // If the modal returned a sharedParentIds subset (half-sibling case)
                    // honour it, otherwise default to all parents (full sibling).
                    const requested = values.sharedParentIds;
                    const shared =
                        requested && requested.length > 0
                            ? requested.filter((id) => parents.includes(id))
                            : parents;
                    if (shared.length > 0) {
                        shared.forEach((parentId) => attachRelation('parent', parentId, created.id));
                    } else {
                        // No shared parents picked at all → record an explicit sibling edge so
                        // the layout still knows they belong together as a step-sibling.
                        attachRelation('sibling', relativeOf.id, created.id);
                    }
                } else {
                    attachRelation('sibling', relativeOf.id, created.id);
                }
                break;
            }
        }
        setAddState(null);
        setPicker(null);
        reload();
    };
 
    /**
     * Remove a single relation between `person` and `otherId`. Used by the
     * person card to let users clean up incorrect parent/spouse/sibling/child
     * links without cascade-deleting either person.
     */
    const handleRemoveRelation = (
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
        removeRelation(target.id);
        reload();
    };
 
    const handleHideToggle = (person: Person) => {
        setPersonHidden(person.treeId, person.id, !person.isHidden);
        setContextMenu(null);
        reload();
    };
 
    const handleDeletePerson = (person: Person) => {
        const confirmed =
            typeof window !== 'undefined'
                ? window.confirm(t('confirmDelete', { defaultValue: 'Delete this person from the tree?' }))
                : true;
        if (!confirmed) return;
        removePerson(person.id);
        if (activeTree?.rootPersonId === person.id) {
            updateTree(person.treeId, { rootPersonId: undefined });
        }
        setCard(null);
        setContextMenu(null);
        reload();
    };
 
    /* ---------------------- Sidebar handlers ---------------------- */
 
    const handleNewTree = () => {
        if (!session) return;
        const name = window.prompt(t('sidebar.newTreePrompt', { defaultValue: 'Name of the new tree' }), `Tree ${trees.length + 1}`);
        if (!name) return;
        const tree = createTree(session.username, name.trim());
        setActiveTreeId(tree.id);
        setSidebarOpen(false);
        reload();
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
                        layout={'fill'}
                        objectFit={`cover`}
                        style={{ pointerEvents: 'none' }}
                        aria-hidden
                    />
                </TreeImageLayer>
                <FloatingTopRight>
                    <IconButton type="button" aria-label={t('controls.search', { defaultValue: 'Search' })}>
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
                    onSubmit={handleSavePerson}
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
                    layout={'fill'}
                    objectFit={`cover`}
                    style={{ pointerEvents: 'none' }}
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
                    onClick={() => {
                        const query = window.prompt(t('controls.searchPrompt', { defaultValue: 'Search by name' }) || '');
                        if (!query) return;
                        const match = persons.find((p) =>
                            formatShortName(p).toLowerCase().includes(query.toLowerCase())
                        );
                        if (!match) {
                            window.alert(t('controls.notFound', { defaultValue: 'Person not found' }));
                            return;
                        }
                        const node = nodeIndex.get(match.id);
                        if (node) {
                            setPan({
                                x: -node.x * scale,
                                y: -node.y * scale
                            });
                        }
                        setCard({ personId: match.id, tab: 'info' });
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </FloatingTopLeft>
 
            <FloatingTopRight>
                <IconButton
                    type="button"
                    aria-label={t('controls.menu', { defaultValue: 'Menu' })}
                    onClick={() => setSidebarOpen(true)}
                >
                    <BurgerIcon />
                </IconButton>
            </FloatingTopRight>
 
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
                    onToggleHidden={() => handleHideToggle(contextMenuPerson)}
                    onToggleShowHidden={() => {
                        setShowHidden((v) => !v);
                        setContextMenu(null);
                    }}
                    onDelete={() => handleDeletePerson(contextMenuPerson)}
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
                onSubmit={handleSavePerson}
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
 
                onRemoveRelation={handleRemoveRelation}
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