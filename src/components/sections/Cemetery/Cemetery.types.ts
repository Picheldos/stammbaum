/**
 * Data model for the "Virtual Cemetery" timeline.
 *
 * Mirrors the shape described in the spec (sections 15 & 28) and is fully
 * driven by the localized `cemetery.json` locale namespace — no hardcoded
 * coordinates in markup.
 */

export interface CemeteryPeriod {
    id: string;
    label: string;
    startYear: number;
    endYear: number;
}

export interface CemeteryPerson {
    id: string;
    firstName: string;
    lastName: string;
    relation: string;
    birthDate?: string;
    deathDate: string;
    photoUrl?: string;
}

/** A person enriched with the values derived for rendering on the timeline. */
export interface CemeteryPersonNode extends CemeteryPerson {
    deathYear: number;
    /** Position along the timeline axis in px (left on desktop, top on mobile). */
    axisPos: number;
    /** Vertical / horizontal branch used for collision avoidance (0 = first row). */
    row: number;
}


export interface CemeteryViewConfig {
    /** Total timeline length in years that the track represents. */
    startYear: number;
    endYear: number;
}
