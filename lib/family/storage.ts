/**
 * LocalStorage-backed CRUD layer for the family tree.
 *
 * The shape of each collection matches the backend tables described in the ТЗ
 * (sections 2.2 and 2.3) so the layer can be swapped for HTTP calls without
 * touching the UI later.
 */

import { FamilyState, Person, PersonRelation, RelationType, Tree, UserPerson } from './types';

const KEY_TREES = 'stammbaum_trees';
const KEY_PERSONS = 'stammbaum_persons';
const KEY_RELATIONS = 'stammbaum_relations';
const KEY_USER_PERSONS = 'stammbaum_user_persons';

const isBrowser = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readArray = <T>(key: string): T[] => {
    if (!isBrowser()) return [];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
        return [];
    }
};

const writeArray = <T>(key: string, value: T[]): void => {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
};

const uid = (): string => {
    const crypto = isBrowser() ? window.crypto : undefined;
    if (crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
};

const nowIso = (): string => new Date().toISOString();

/** Normalize a symmetric relation pair so the two endpoints can be compared with simple equality. */
const sortPair = (a: string, b: string): [string, string] => (a < b ? [a, b] : [b, a]);

export const loadState = (): FamilyState => ({
    trees: readArray<Tree>(KEY_TREES),
    persons: readArray<Person>(KEY_PERSONS),
    relations: readArray<PersonRelation>(KEY_RELATIONS),
    userPersons: readArray<UserPerson>(KEY_USER_PERSONS)
});

export const saveState = (state: FamilyState): void => {
    writeArray(KEY_TREES, state.trees);
    writeArray(KEY_PERSONS, state.persons);
    writeArray(KEY_RELATIONS, state.relations);
    writeArray(KEY_USER_PERSONS, state.userPersons);
};

/* ---------------------------- Trees ---------------------------- */

export const listTrees = (userId: string): Tree[] => loadState().trees.filter((t) => t.userId === userId);

export const createTree = (userId: string, name: string): Tree => {
    const state = loadState();
    const tree: Tree = {
        id: uid(),
        userId,
        name,
        createdAt: nowIso(),
        updatedAt: nowIso()
    };
    state.trees.push(tree);
    saveState(state);
    return tree;
};

export const updateTree = (treeId: string, patch: Partial<Omit<Tree, 'id' | 'userId' | 'createdAt'>>): Tree | null => {
    const state = loadState();
    const idx = state.trees.findIndex((t) => t.id === treeId);
    if (idx === -1) return null;
    const next: Tree = { ...state.trees[idx], ...patch, updatedAt: nowIso() };
    state.trees[idx] = next;
    saveState(state);
    return next;
};

/* ---------------------------- Persons ---------------------------- */

export const listPersons = (treeId: string): Person[] => loadState().persons.filter((p) => p.treeId === treeId);

export const getPerson = (personId: string): Person | null => loadState().persons.find((p) => p.id === personId) ?? null;

export type PersonInput = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;

export const createPerson = (input: PersonInput): Person => {
    const state = loadState();
    const person: Person = { ...input, id: uid(), createdAt: nowIso(), updatedAt: nowIso() };
    state.persons.push(person);
    saveState(state);
    return person;
};

export const updatePerson = (personId: string, patch: Partial<PersonInput>): Person | null => {
    const state = loadState();
    const idx = state.persons.findIndex((p) => p.id === personId);
    if (idx === -1) return null;
    const next: Person = { ...state.persons[idx], ...patch, updatedAt: nowIso() };
    state.persons[idx] = next;
    saveState(state);
    return next;
};

export const removePerson = (personId: string): void => {
    const state = loadState();
    state.persons = state.persons.filter((p) => p.id !== personId);
    state.relations = state.relations.filter((r) => r.fromId !== personId && r.toId !== personId);
    state.userPersons = state.userPersons.filter((up) => up.personId !== personId);
    saveState(state);
};

/* ---------------------------- Relations ---------------------------- */

export const listRelations = (treeId: string): PersonRelation[] => loadState().relations.filter((r) => r.treeId === treeId);

/** Add a relation, normalizing symmetric pairs so duplicates are impossible. */
export const addRelation = (
    treeId: string,
    type: RelationType,
    fromId: string,
    toId: string,
    extras: Pick<PersonRelation, 'marriageDate' | 'divorceDate'> = {}
): PersonRelation | null => {
    if (fromId === toId) return null;
    const state = loadState();

    let from = fromId;
    let to = toId;
    if (type === 'spouse' || type === 'sibling') {
        [from, to] = sortPair(fromId, toId);
    }

    const exists = state.relations.find(
        (r) => r.treeId === treeId && r.type === type && r.fromId === from && r.toId === to
    );
    if (exists) return exists;

    const relation: PersonRelation = {
        id: uid(),
        treeId,
        type,
        fromId: from,
        toId: to,
        createdAt: nowIso(),
        ...extras
    };
    state.relations.push(relation);
    saveState(state);
    return relation;
};

export const removeRelation = (relationId: string): void => {
    const state = loadState();
    state.relations = state.relations.filter((r) => r.id !== relationId);
    saveState(state);
};

/* ---------------------------- User ↔ Person links ---------------------------- */

export const listUserPersons = (userId: string, treeId: string): UserPerson[] =>
    loadState().userPersons.filter((up) => up.userId === userId && up.treeId === treeId);

export const upsertUserPerson = (input: Omit<UserPerson, 'id' | 'createdAt'> & { id?: string }): UserPerson => {
    const state = loadState();
    const existingIdx = state.userPersons.findIndex(
        (up) => up.userId === input.userId && up.personId === input.personId && up.treeId === input.treeId
    );

    if (existingIdx !== -1) {
        const next: UserPerson = { ...state.userPersons[existingIdx], ...input };
        state.userPersons[existingIdx] = next;
        saveState(state);
        return next;
    }

    const next: UserPerson = { id: input.id ?? uid(), createdAt: nowIso(), ...input };
    state.userPersons.push(next);
    saveState(state);
    return next;
};

export const setPersonHidden = (treeId: string, personId: string, hidden: boolean): Person | null =>
    updatePerson(personId, { isHidden: hidden, treeId } as Partial<PersonInput>);
