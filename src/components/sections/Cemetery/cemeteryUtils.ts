import { CemeteryPerson, CemeteryPeriod, CemeteryPersonNode } from './Cemetery.types';

/** Extract the death year (4-digit) from an ISO date string "YYYY-MM-DD". */
export const getDeathYear = (person: CemeteryPerson): number => {
    const match = /(\d{4})/.exec(person.deathDate);
    return match ? parseInt(match[1], 10) : 0;
};

/** Full "LastName FirstName" name used on cards. */
export const formatPersonName = (person: CemeteryPerson): string => {
    return [person.lastName, person.firstName].filter(Boolean).join(' ') || '—';
};

/** "DD.MM.YYYY — DD.MM.YYYY" lifespan, omitting empty sides. */
export const formatLifespan = (person: CemeteryPerson): string => {
    const l = person.birthDate ? formatDate(person.birthDate) : '';
    const r = person.deathDate ? formatDate(person.deathDate) : '';
    if (l && r) return `${l} — ${r}`;
    if (l) return l;
    if (r) return `— ${r}`;
    return '';
};

const formatDate = (iso: string): string => {
    const ymd = iso.slice(0, 10);
    const [y, m, d] = ymd.split('-');
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
};

/** Year-range containing a given year, used to sync the active period on scroll. */
export const findPeriodForYear = (year: number, periods: CemeteryPeriod[]): CemeteryPeriod | undefined => {
    return periods.find((p) => year >= p.startYear && year <= p.endYear) ?? periods[0];
};

/* ===================================================================== */
/*  Layout constants — single source of truth for the timeline layout     */
/* ===================================================================== */

/** Horizontal padding (px, in reference units) on each side of the timeline track. */
export const TRACK_PADDING = 80;

/** Pixels per year at the FHD reference width (1920px). */
export const PIXELS_PER_YEAR_DESKTOP = 19;
/** Pixels per year on mobile (xs = 375px reference). */
export const PIXELS_PER_YEAR_MOBILE = 4;

/* Card dimensions from the styled component (desktop FHD ~150 x 70). */
export const CARD_WIDTH_DESKTOP = 150;
export const CARD_HEIGHT_DESKTOP = 70;
export const CARD_WIDTH_MOBILE = 140;
export const CARD_HEIGHT_MOBILE = 56;

/** Gap between card and axis line, and between stacked rows. */
export const CARD_GAP = 8;

/** Timeline line bottom offset (desktop, from track bottom). */
export const LINE_BOTTOM_OFFSET = 36;
/** Timeline line left offset (mobile) expressed as vw from `vw(30, 'xs')` = 8vw.
 *  Pixel equivalent at xs (375px) reference — used for JS-side card positioning. */
export const LINE_LEFT_VW = 8;
export const LINE_LEFT_PX_AT_XS = 30;
/** Year-tick label left offset (mobile) — pixel value at xs reference. */
export const YEAR_TICK_LEFT_PX_AT_XS = 44;

/** Vertical stacking unit on desktop: card height + gap. */
export const CARD_STACK_DESKTOP = CARD_HEIGHT_DESKTOP + CARD_GAP; // 78
/** Horizontal stacking unit on mobile: card width + gap. */
export const CARD_STACK_MOBILE = CARD_WIDTH_MOBILE + CARD_GAP; // 148

export const TIMELINE_AXIS_LEFT = 32;

/* ===================================================================== */
/*  Data parsing — safe extraction from i18next `t()` return values       */
/* ===================================================================== */

/** Safe-parse the `periods` array returned by `t('periods', { returnObjects: true })`. */
export const parsePeriods = (value: unknown): CemeteryPeriod[] =>
    Array.isArray(value)
        ? (value as CemeteryPeriod[]).filter(
              (p): p is CemeteryPeriod =>
                  typeof p === 'object' &&
                  p !== null &&
                  typeof p.id === 'string' &&
                  typeof p.label === 'string' &&
                  typeof p.startYear === 'number' &&
                  typeof p.endYear === 'number'
          )
        : [];

/** Safe-parse the `persons` array returned by `t('persons', { returnObjects: true })`. */
export const parsePersons = (value: unknown): CemeteryPerson[] =>
    Array.isArray(value)
        ? (value as CemeteryPerson[]).filter(
              (p): p is CemeteryPerson =>
                  typeof p === 'object' &&
                  p !== null &&
                  typeof p.id === 'string' &&
                  typeof p.firstName === 'string' &&
                  typeof p.lastName === 'string' &&
                  typeof p.relation === 'string' &&
                  typeof p.deathDate === 'string'
          )
        : [];

/* ===================================================================== */
/*  Layout computation                                                    */
/* ===================================================================== */

/** Pixel position of a year along the timeline axis (0 = start year). */
export const computeAxisPos = (
    year: number,
    startYear: number,
    endYear: number,
    pixelsPerYear: number
): number => {
    const totalYears = endYear - startYear;
    if (totalYears <= 0) return TRACK_PADDING;
    const clamped = Math.max(0, Math.min(totalYears, year - startYear));
    return TRACK_PADDING + clamped * pixelsPerYear;
};

/**
 * Enrich persons with death-year, axis position and collision-avoidance row.
 * Returns a new array sorted by axisPos (natural left-to-right / top-to-bottom order).
 */
export const computePersonNodes = (
    persons: CemeteryPerson[],
    startYear: number,
    endYear: number,
    pixelsPerYear: number,
    cardDimension: number
): CemeteryPersonNode[] => {
    const totalYears = endYear - startYear;

    const nodes: CemeteryPersonNode[] = persons.map((person) => ({
        ...person,
        deathYear: getDeathYear(person),
        axisPos:
            totalYears > 0
                ? computeAxisPos(getDeathYear(person), startYear, endYear, pixelsPerYear)
                : TRACK_PADDING,
        row: 0
    }));

    // Sort by axis position so collision detection is left-to-right.
    nodes.sort((a, b) => a.axisPos - b.axisPos);

    // Greedy row assignment: place each node in the lowest row that doesn't collide.
    for (let i = 0; i < nodes.length; i++) {
        let row = 0;
        for (let j = 0; j < i; j++) {
            if (Math.abs(nodes[i].axisPos - nodes[j].axisPos) < cardDimension) {
                row = Math.max(row, nodes[j].row + 1);
            }
        }
        nodes[i].row = row;
    }

    return nodes;
};
