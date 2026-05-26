/**
 * Derived relationship queries that the UI uses to render tabs (Parents/Spouses/
 * Children/Siblings) and to drive the tree layout. Everything here is pure —
 * results depend only on the relation list passed in.
 */

import { Person, PersonRelation } from './types';

const otherEnd = (rel: PersonRelation, personId: string): string =>
    rel.fromId === personId ? rel.toId : rel.fromId;

export const getParents = (personId: string, relations: PersonRelation[]): string[] =>
    relations.filter((r) => r.type === 'parent' && r.toId === personId).map((r) => r.fromId);

export const getChildren = (personId: string, relations: PersonRelation[]): string[] =>
    relations.filter((r) => r.type === 'parent' && r.fromId === personId).map((r) => r.toId);

export const getSpouses = (personId: string, relations: PersonRelation[]): string[] =>
    relations
        .filter((r) => r.type === 'spouse' && (r.fromId === personId || r.toId === personId))
        .map((r) => otherEnd(r, personId));

/**
 * Siblings = anyone sharing at least one parent. We also surface explicit
 * "sibling" edges so users without recorded parents can still be linked.
 */
export const getSiblings = (personId: string, relations: PersonRelation[]): string[] => {
    const out = new Set<string>();

    const myParents = getParents(personId, relations);
    for (const parentId of myParents) {
        for (const childId of getChildren(parentId, relations)) {
            if (childId !== personId) out.add(childId);
        }
    }

    for (const rel of relations) {
        if (rel.type !== 'sibling') continue;
        if (rel.fromId !== personId && rel.toId !== personId) continue;
        out.add(otherEnd(rel, personId));
    }

    return Array.from(out);
};

export const getSpousePair = (personId: string, relations: PersonRelation[]): string | undefined => {
    const spouses = getSpouses(personId, relations);
    return spouses[0];
};

/**
 * Return the shared children of two persons. Used when adding a child to a
 * focused person so we automatically attach the second parent.
 */
export const getSharedChildren = (a: string, b: string, relations: PersonRelation[]): string[] => {
    const aChildren = new Set(getChildren(a, relations));
    return getChildren(b, relations).filter((id) => aChildren.has(id));
};

export interface PersonLookup {
    byId: (id: string) => Person | undefined;
}

export const buildLookup = (persons: Person[]): PersonLookup => {
    const map = new Map(persons.map((p) => [p.id, p]));
    return { byId: (id) => map.get(id) };
};

/** Pretty full name used in cards. */
export const formatFullName = (person: Person): string => {
    const parts = [person.lastName, person.firstName, person.middleName].filter(Boolean);
    return parts.join(' ').trim();
};

export const formatShortName = (person: Person): string => {
    const parts = [person.lastName, person.firstName].filter(Boolean);
    return parts.join(' ').trim() || '—';
};

export const formatLifespan = (person: Person): string => {
    const left = person.birthDate ? formatDate(person.birthDate) : '';
    const right = person.deathDate ? formatDate(person.deathDate) : '';
    if (left && right) return `${left} — ${right}`;
    if (left) return left;
    if (right) return `— ${right}`;
    return '';
};

export const formatDate = (iso: string): string => {
    if (!iso) return '';
    // Accept YYYY-MM-DD or full ISO.
    const ymd = iso.slice(0, 10);
    const [y, m, d] = ymd.split('-');
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
};
