/**
 * Tree layout algorithm.
 *
 * Two horizontal "bands" stack vertically per generation:
 *  - ancestors fan downward (positive generations) matching the mock-up where
 *    the focus person sits at the top of the trunk and predecessors descend
 *    toward the roots;
 *  - descendants fan upward (negative generations).
 *
 * Layout strategy:
 *  1. BFS from the focus person, propagating generation index:
 *       parent edge  → +1   child edge  → -1   spouse/sibling → 0
 *  2. Recursively compute the width of each ancestor subtree (Reingold-Tilford
 *     style). Couples count as a single unit; their X is the average of the
 *     two spouse positions.
 *  3. Place each generation horizontally, then center couples above their
 *     joint children using a second pass.
 */

import { Person, PersonRelation } from './types';
import { getChildren, getParents, getSiblings, getSpouses } from './relations';

export interface NodePosition {
    personId: string;
    x: number;
    y: number;
    generation: number;
    /** When the node is part of a couple, the spouse rendered to its right. */
    coupledWith?: string;
}

export interface ConnectionSegment {
    /** Used to deduplicate identical lines. */
    id: string;
    kind: 'spouse' | 'parentChild';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface TreeLayout {
    nodes: NodePosition[];
    connections: ConnectionSegment[];
    bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export interface LayoutOptions {
    /** Width of a single person card in canvas units. */
    nodeWidth: number;
    /** Height of a single person card. */
    nodeHeight: number;
    /** Horizontal gap between sibling/cousin cards. */
    columnGap: number;
    /** Vertical distance between two consecutive generations. */
    rowGap: number;
}

export const DEFAULT_LAYOUT_OPTIONS: LayoutOptions = {
    nodeWidth: 168,
    nodeHeight: 96,
    columnGap: 24,
    rowGap: 64
};

interface CoupleUnit {
    /** Persons rendered side-by-side in this unit (1 or 2 people). */
    members: string[];
    /** Subtree width in "node slots" (including children of this couple). */
    width: number;
    /** X centre of the unit, set after placement. */
    centre: number;
    /** Generation index (0 = focus). */
    generation: number;
    /** Recursive ancestor units placed below. */
    ancestors: CoupleUnit[];
    /** Recursive descendant units placed above. */
    descendants: CoupleUnit[];
    /** True once the unit's children have linked back to it. */
    linkedFromBelow?: boolean;
}

const slotWidth = (opts: LayoutOptions): number => opts.nodeWidth + opts.columnGap;

const coupleSlot = (members: string[], opts: LayoutOptions): number =>
    members.length === 2 ? opts.nodeWidth * 2 + opts.columnGap * 1.5 : opts.nodeWidth + opts.columnGap;

/**
 * Build a CoupleUnit tree for ancestors of `personId`. We treat each generation
 * as parent-couples: the (mother + father) pair of the current node, then their
 * own parent couples, etc. Step-parents create separate single-person units.
 */
const buildAncestors = (
    personId: string,
    generation: number,
    relations: PersonRelation[],
    seen: Set<string>
): CoupleUnit[] => {
    if (seen.has(personId)) return [];
    seen.add(personId);

    const parents = getParents(personId, relations);
    if (parents.length === 0) return [];

    const remaining = new Set(parents);
    const units: CoupleUnit[] = [];

    // Pair parents who are spouses, leftovers become solo units.
    for (const parentId of parents) {
        if (!remaining.has(parentId)) continue;
        const spouses = getSpouses(parentId, relations);
        const partner = spouses.find((s) => remaining.has(s));
        const members = partner ? [parentId, partner] : [parentId];
        members.forEach((id) => remaining.delete(id));

        const ancestors = members.flatMap((id) => buildAncestors(id, generation + 1, relations, seen));
        units.push({
            members,
            width: 0, // computed later
            centre: 0,
            generation: generation + 1,
            ancestors,
            descendants: []
        });
    }
    return units;
};

const buildDescendants = (
    personId: string,
    spouseId: string | undefined,
    generation: number,
    relations: PersonRelation[],
    seen: Set<string>
): CoupleUnit[] => {
    if (seen.has(personId)) return [];
    seen.add(personId);
    if (spouseId) seen.add(spouseId);

    let children = getChildren(personId, relations);
    if (spouseId) {
        // Only common children belong under this couple. Personal children are
        // attached as separate single-parent units alongside the couple.
        const spouseChildren = new Set(getChildren(spouseId, relations));
        children = children.filter((id) => spouseChildren.has(id));
    }

    const units: CoupleUnit[] = [];
    for (const childId of children) {
        if (seen.has(childId)) continue;
        const childSpouses = getSpouses(childId, relations);
        const childSpouse = childSpouses[0];
        const members = childSpouse ? [childId, childSpouse] : [childId];
        const descendants = buildDescendants(childId, childSpouse, generation - 1, relations, seen);
        units.push({
            members,
            width: 0,
            centre: 0,
            generation: generation - 1,
            ancestors: [],
            descendants
        });
    }
    return units;
};

/**
 * Recursively measure the width of a unit's subtree along a single direction
 * ('down' walks ancestors, 'up' walks descendants). Non-root units only have
 * children on one side so they are happy with one pass; for the root unit we
 * call this once per side and combine the totals in {@link layoutTree}.
 */
const measure = (unit: CoupleUnit, direction: 'up' | 'down', opts: LayoutOptions): number => {
    const selfWidth = coupleSlot(unit.members, opts);
    const children = direction === 'down' ? unit.ancestors : unit.descendants;
    const childWidth = children.reduce((acc, child) => acc + measure(child, direction, opts), 0);
    unit.width = Math.max(selfWidth, childWidth);
    return unit.width;
};

const place = (
    unit: CoupleUnit,
    leftEdge: number,
    direction: 'up' | 'down',
    opts: LayoutOptions,
    nodes: NodePosition[]
): void => {
    const children = direction === 'down' ? unit.ancestors : unit.descendants;
    const childTotal = children.reduce((acc, c) => acc + c.width, 0);
    const childOffset = Math.max(0, (unit.width - childTotal) / 2);

    let cursor = leftEdge + childOffset;
    for (const child of children) {
        place(child, cursor, direction, opts, nodes);
        cursor += child.width;
    }

    if (children.length > 0) {
        const first = children[0];
        const last = children[children.length - 1];
        unit.centre = (first.centre + last.centre) / 2;
    } else {
        unit.centre = leftEdge + unit.width / 2;
    }

    const self = coupleSlot(unit.members, opts);
    const selfLeft = unit.centre - self / 2;
    const y = unit.generation * (opts.nodeHeight + opts.rowGap);

    unit.members.forEach((id, i) => {
        const x = selfLeft + i * (opts.nodeWidth + opts.columnGap);
        nodes.push({
            personId: id,
            x,
            y,
            generation: unit.generation,
            coupledWith: unit.members.length === 2 ? unit.members[1 - i] : undefined
        });
    });
};

const buildConnections = (
    nodes: NodePosition[],
    relations: PersonRelation[],
    opts: LayoutOptions
): ConnectionSegment[] => {
    const out: ConnectionSegment[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.personId, n]));
    const seen = new Set<string>();

    const push = (segment: Omit<ConnectionSegment, 'id'>): void => {
        const key = `${segment.kind}:${[segment.x1, segment.y1, segment.x2, segment.y2].join(',')}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ ...segment, id: key });
    };

    for (const rel of relations) {
        const a = nodeMap.get(rel.fromId);
        const b = nodeMap.get(rel.toId);
        if (!a || !b) continue;

        if (rel.type === 'spouse') {
            const left = a.x < b.x ? a : b;
            const right = a.x < b.x ? b : a;
            push({
                kind: 'spouse',
                x1: left.x + opts.nodeWidth,
                y1: left.y + opts.nodeHeight / 2,
                x2: right.x,
                y2: right.y + opts.nodeHeight / 2
            });
        } else if (rel.type === 'parent') {
            const parent = nodeMap.get(rel.fromId)!;
            const child = nodeMap.get(rel.toId)!;
            const parentBottom = { x: parent.x + opts.nodeWidth / 2, y: parent.y + opts.nodeHeight };
            const childTop = { x: child.x + opts.nodeWidth / 2, y: child.y };
            const startY = parent.generation > child.generation ? parent.y : parent.y + opts.nodeHeight;
            const endY = parent.generation > child.generation ? child.y + opts.nodeHeight : child.y;
            push({
                kind: 'parentChild',
                x1: parentBottom.x,
                y1: startY,
                x2: childTop.x,
                y2: endY
            });
        }
    }

    return out;
};

/**
 * Compute the full layout for a given root person.
 *
 * The function is tolerant to floating relations: persons not connected to the
 * focus via known edges are placed on the focus generation to the right so the
 * user can still see and edit them.
 */
export const layoutTree = (
    rootPersonId: string,
    persons: Person[],
    relations: PersonRelation[],
    options: Partial<LayoutOptions> = {}
): TreeLayout => {
    const opts: LayoutOptions = { ...DEFAULT_LAYOUT_OPTIONS, ...options };

    const personIds = new Set(persons.map((p) => p.id));
    if (!personIds.has(rootPersonId)) {
        return { nodes: [], connections: [], bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 } };
    }

    const rootSpouses = getSpouses(rootPersonId, relations);
    const rootSpouse = rootSpouses[0];
    const rootMembers = rootSpouse ? [rootPersonId, rootSpouse] : [rootPersonId];

    // Track which persons have been picked up by the recursion so the same
    // person isn't placed in two ancestor/descendant units. The recursion adds
    // each visited node to the set itself — pre-seeding it here with the root
    // members would short-circuit buildAncestors/buildDescendants on their very
    // first call and leave Maria/Pyotr (etc.) unplaced.
    const seenAncestors = new Set<string>();
    const seenDescendants = new Set<string>();

    const rootUnit: CoupleUnit = {
        members: rootMembers,
        width: 0,
        centre: 0,
        generation: 0,
        ancestors: rootMembers.flatMap((id) => buildAncestors(id, 0, relations, seenAncestors)),
        descendants: buildDescendants(rootPersonId, rootSpouse, 0, relations, seenDescendants)
    };

    // Measure both sides independently — the rootUnit is the only unit that
    // has both ancestors and descendants.
    const selfWidth = coupleSlot(rootMembers, opts);
    const ancestorsTotal = rootUnit.ancestors.reduce((acc, c) => acc + measure(c, 'down', opts), 0);
    const descendantsTotal = rootUnit.descendants.reduce((acc, c) => acc + measure(c, 'up', opts), 0);
    rootUnit.width = Math.max(selfWidth, ancestorsTotal, descendantsTotal);

    const nodes: NodePosition[] = [];
    place(rootUnit, 0, 'down', opts, nodes);

    // Place descendants centred under the rootUnit. `place` was already invoked
    // for the rootUnit above so `rootUnit.centre` is now meaningful.
    let descCursor = rootUnit.centre - descendantsTotal / 2;
    for (const desc of rootUnit.descendants) {
        place(desc, descCursor, 'up', opts, nodes);
        descCursor += desc.width;
    }

    // Siblings of root that aren't already placed via shared parents.
    const placed = new Set(nodes.map((n) => n.personId));
    const siblings = getSiblings(rootPersonId, relations).filter((id) => !placed.has(id));
    const rootCentre = rootUnit.centre;
    siblings.forEach((sib, i) => {
        const offset = (i + 1) * slotWidth(opts) * (i % 2 === 0 ? -1 : 1);
        nodes.push({
            personId: sib,
            x: rootCentre + offset - opts.nodeWidth / 2,
            y: 0,
            generation: 0
        });
        placed.add(sib);
    });

    // Floating persons (unreachable via the focus) — show at the right side.
    let floatX = (rootUnit.width || slotWidth(opts)) + slotWidth(opts);
    for (const p of persons) {
        if (placed.has(p.id)) continue;
        nodes.push({ personId: p.id, x: floatX, y: 0, generation: 0 });
        placed.add(p.id);
        floatX += slotWidth(opts);
    }

    const connections = buildConnections(nodes, relations, opts);

    const minX = Math.min(0, ...nodes.map((n) => n.x));
    const maxX = Math.max(opts.nodeWidth, ...nodes.map((n) => n.x + opts.nodeWidth));
    const minY = Math.min(0, ...nodes.map((n) => n.y));
    const maxY = Math.max(opts.nodeHeight, ...nodes.map((n) => n.y + opts.nodeHeight));

    return { nodes, connections, bounds: { minX, maxX, minY, maxY } };
};
