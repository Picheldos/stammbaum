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

export const formatShortName = (
    person: Pick<Person, 'lastName' | 'firstName'>
): string => {
    const parts = [person.lastName, person.firstName].filter(Boolean);
    return parts.join(' ').trim() || '—';
};

export const formatLifespan = (person: Pick<Person, 'birthDate' | 'deathDate'>): string => {
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

/** Translation function used for relation labels (next-i18next `t`). */
export type TranslationFn = (key: string, opts?: { defaultValue?: string }) => string;

/**
 * Human-readable label for a person relative to a "focus" person (the tree
 * root). Shared by the family-tree canvas and the virtual-cemetery timeline so
 * both pages show the same relative wording. Falls back to the generic
 * "Relative" label when no matching edge is found.
 */
export const labelForRelation = (
    person: Person,
    focusId: string | undefined,
    relations: PersonRelation[],
    t: TranslationFn
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
