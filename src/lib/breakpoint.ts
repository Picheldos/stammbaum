import breakpoints, { Breakpoints } from '@/style/breakpoints';

/**
 * Determine which breakpoint matches the given width in pixels.
 */
export const getBreakpointForWidth = (width: number): Breakpoints => {
    const sortedBreakpoints = Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a) // Sort descending
        .map(([name]) => name as Breakpoints);

    for (const bp of sortedBreakpoints) {
        if (width >= breakpoints[bp]) {
            return bp;
        }
    }

    return 'xs';
};
