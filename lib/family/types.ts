/**
 * Family tree domain types.
 *
 * Schemas mirror the ТЗ sections 2.2 (persons / user_persons) and 2.3 (relations).
 * Until the backend is implemented, all records live in LocalStorage. See `storage.ts`.
 */

export type Gender = 'male' | 'female';

/** Section 2.3: bidirectional relation type. `parent` is the only directional one (from = parent, to = child). */
export type RelationType = 'spouse' | 'parent' | 'sibling';

export interface Person {
    id: string;
    treeId: string;
    firstName: string; // Имя
    lastName: string; // Фамилия
    middleName?: string; // Отчество
    maidenName?: string; // Девичья фамилия
    gender: Gender;
    birthDate?: string; // YYYY-MM-DD
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    nationality?: string;
    occupation?: string;
    biography?: string; // "заметка"
    photo?: string; // data URL (base64 from FileReader)
    isHidden?: boolean; // соответствует флагу is_hidden из user_persons
    createdAt: string;
    updatedAt: string;
}

export interface PersonRelation {
    id: string;
    treeId: string;
    /**
     * Directional for `parent` (fromId = родитель, toId = ребёнок).
     * For `spouse` and `sibling` the pair is normalized (fromId < toId) so the
     * relation is stored only once and queries can match in either direction.
     */
    fromId: string;
    toId: string;
    type: RelationType;
    marriageDate?: string;
    divorceDate?: string;
    createdAt: string;
}

export interface Tree {
    id: string;
    userId: string;
    name: string;
    rootPersonId?: string;
    createdAt: string;
    updatedAt: string;
}

/** Section 2.2.2 — association between a user and a person in a tree. */
export interface UserPerson {
    id: string;
    userId: string;
    treeId: string;
    personId: string;
    isOwner: boolean;
    isRoot: boolean;
    isHidden: boolean;
    canEdit: boolean;
    createdAt: string;
}

export interface FamilyState {
    trees: Tree[];
    persons: Person[];
    relations: PersonRelation[];
    userPersons: UserPerson[];
}

/** Convenience union used in the "add relative" flow. */
export type AddRelativeKind = 'mother' | 'father' | 'spouse' | 'son' | 'daughter' | 'brother' | 'sister';
