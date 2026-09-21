import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';
import { TIMELINE_AXIS_LEFT } from './cemeteryUtils';

/* ===================================================================== */
/*  Page shell — sits inside Layout > MainArea                            */
/* ===================================================================== */

/** Full viewport slice below the header. `--vh` is set by useResize.
 *  Flex column: nav rail on top, scrollable timeline in the middle
 *  (fills / centers the remaining slice), add-button pinned to the bottom.
 *  Height is always one full viewport minus the sticky header height
 *  (mobile and desktop header offsets are kept as raw viewport-height CSS). */
export const CemeterySection = styled.section`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 100px);
    padding: 0;

    ${mediaBreakpointDown('lg')} {
        height: calc(var(--vh, 1vh) * 100 - 55px);
        overflow: hidden;
        padding-top: 0;
    }

    ${mediaBreakpointUp('lg')} {
        padding: 0 ${vw(20)};
    }
`;

/**
 * Retro/Scandinavian meadow backdrop. Opacity is kept low so the timeline
 * stays readable — the field is decorative only. The picture is rendered
 * with next/image (fill), the wrapper keeps it fixed behind the content.
 */
export const PageBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;

    img {
        object-fit: cover;
        object-position: center;
    }
`;

/* ===================================================================== */
/*  Period navigation rail (sticky on mobile)                           */
/* ===================================================================== */

export const PeriodNavRail = styled.nav`
    position: relative;
    z-index: 2;
    margin-bottom: ${vw(8)};

    padding: ${vw(72)} 0;

    ${mediaBreakpointDown('md')} {
        position: sticky;
        top: 0;
        margin-top: 0;
        margin-bottom: ${vw(12, 'xs')};
    }
`;

export const PeriodChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${vw(10.24, 'xs')};

    ${mediaBreakpointDown('md')} {
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;

        &::after {
            content: '';
            display: inline-block;
            width: ${vw(8, 'xs')};
        }
    }

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(16)};
    }
`;

/* ===================================================================== */
/*  Floating controls (search / menu) — same layout as the Family tree    */
/* ===================================================================== */

export const FloatingTopRight = styled.div`
    position: absolute;
    top: ${vw(12, 'xs')};
    right: ${vw(20, 'xs')};
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    z-index: 6;

    ${mediaBreakpointUp('lg')} {
        top: ${vw(12)};
        right: ${vw(20)};
        gap: ${vw(8)};
    }
`;

export const FloatingIconButton = styled.button`
    width: ${vw(36, 'xs')};
    height: ${vw(36, 'xs')};
    border-radius: 50%;
    border: none;
    background: transparent;
    color: ${color('textPrimary')};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg {
        width: ${vw(22, 'xs')};
        height: ${vw(22, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(36)};
        height: ${vw(36)};

        svg {
            width: ${vw(22)};
            height: ${vw(22)};
        }
    }

    ${hover(css`
        background: ${color('white', 0.4)};
    `)}
`;

/* ===================================================================== */
/*  Timeline                                                            */
/* ===================================================================== */

/** Scrollable window. Horizontal on desktop, vertical on mobile.
 *  `flex: 1` centers the timeline vertically inside the viewport slice
 *  (desktop) / fills the remaining mobile slice; the axis + cards grow
 *  from the middle outward, so no fixed height is imposed on the track. */
export const ScrollViewport = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    align-items: center; /* vertical centering of the desktop track */
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    /* No CSS smooth-scroll: it turns each wheel notch into a slow animation and
       makes manual scrolling crawl. Programmatic jumps pass behavior:'smooth'. */
    scrollbar-gutter: stable;

    ${mediaBreakpointDown('md')} {
        align-items: stretch;
        overflow-x: hidden;
        overflow-y: auto;
    }
`;

/** The track — sized via width/height props (px on desktop / height on mobile). */
export const TimelineTrack = styled.div<{ $width?: number; $height?: number }>`
    position: relative;
    flex: 0 0 auto;
    width: ${({ $width }) => ($width ? `${$width}px` : '100%')};
    height: ${({ $height }) => ($height ? `${$height}px` : '100%')};

    ${mediaBreakpointDown('md')} {
        width: 100%;
    }
`;

/** Horizontal / vertical axis line spanning the whole track. */
export const TimelineLine = styled.div<{ $mobile: boolean }>`
    position: absolute;
    z-index: 1;
    background: ${color('cemeteryGray')};

    ${mediaBreakpointDown('md')} {
        left: ${TIMELINE_AXIS_LEFT}px;
        top: 0;
        bottom: 0;
        width: 1px;
        height: auto;
    }

    ${mediaBreakpointUp('md')} {
        left: 0;
        right: 0;
        bottom: 36px;
        height: 1px;
        width: auto;
    }
`;

/** Container for a year tick + its label, positioned on the axis. */
export const TimelineYear = styled.div<{ $mobile: boolean; $axisPos: number }>`
    position: absolute;
    z-index: 2;

    ${mediaBreakpointDown('md')} {
        left: ${TIMELINE_AXIS_LEFT + 10}px;
        top: ${({ $axisPos }) => $axisPos}px;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: ${vw(6.827, 'xs')};
    }

    ${mediaBreakpointUp('md')} {
        left: ${({ $axisPos }) => $axisPos}px;
        bottom: 10px;
        transform: translateX(-50%);
    }
`;

export const CardAnchor = styled.div`
    position: absolute;
    z-index: 3;
    width: max-content;
`;


export const YearDot = styled.span<{ $size: number }>`
    flex-shrink: 0;
    border-radius: 50%;
    background: ${color('cemeteryGray')};
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;

    /* desktop: lift the dot onto the axis line (line sits at bottom: 36px,
       label occupies 10-23px — dot center lands at ~36px) */
    ${mediaBreakpointUp('md')} {
        position: absolute;
        left: 50%;
        bottom: 22px;
        transform: translateX(-50%);
    }
`;

export const YearLabel = styled.span`
    display: block;
    margin-top: ${vw(3.413, 'xs')};
    ${font('labelStrong')};
    color: ${color('cemeteryGray')};
    white-space: nowrap;

    ${mediaBreakpointUp('md')} {
        margin-top: 6px;
    }
`;

export const DeathYearLabel = styled.span<{ $mobile: boolean; $axisPos: number }>`
    position: absolute;
    z-index: 2;
    ${font('label')};
    color: ${color('cemeteryGray')};
    white-space: nowrap;

    ${mediaBreakpointDown('md')} {
        left: ${TIMELINE_AXIS_LEFT + 20}px;
        top: ${({ $axisPos }) => $axisPos}px;
        transform: translateY(-50%);
    }

    ${mediaBreakpointUp('md')} {
        left: ${({ $axisPos }) => $axisPos}px;
        bottom: 16px; /* Увеличил отступ, чтобы был виден под маркером */
        transform: translateX(-50%);
    }
`;

/** Dot marking a single relative on the axis, aligned to the timeline line. */
export const TimelineMarker = styled.div<{ $mobile: boolean; $axisPos: number }>`
    position: absolute;
    z-index: 2;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${color('cemeteryGray')};

    ${mediaBreakpointDown('md')} {
        left: ${TIMELINE_AXIS_LEFT}px;
        top: ${({ $axisPos }) => $axisPos}px;
        transform: translateY(-50%);
    }

    ${mediaBreakpointUp('md')} {
        left: ${({ $axisPos }) => $axisPos}px;
        bottom: 33px; /* Маркер на линии */
        transform: translateX(-50%);
    }
`;

/** Anchor wrapping a card + its connector for a single relative. */
/* ===================================================================== */
/*  Period chip — rounded vector path from the Figma design              */
/* ===================================================================== */

export const PeriodChip = styled.button<{ $active?: boolean }>`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${vw(142, 'xs')};
    height: ${vw(47, 'xs')};
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        width: ${vw(163)};
        height: ${vw(55)};
    }

    svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    path {
        fill: ${({ $active }) => ($active ? color('meadowBlue') : 'transparent')};
        stroke: ${({ $active }) => ($active ? color('meadowBlue') : color('ink', 0.5))};
        stroke-width: 1;
        transition: fill 0.3s ease-in-out, stroke 0.3s ease-in-out;
    }

    span {
        position: relative;
        z-index: 1;
        ${font('button')};
        color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
        text-align: center;
        white-space: nowrap;
        transition: color 0.3s ease-in-out;
    }

    ${hover(css`
        transform: translateY(-1px);
    `)}

    &:active {
        transform: translateY(0);
    }

    &:focus-visible {
        outline: 2px solid ${color('forest')};
        outline-offset: 3px;
    }
`;

/* ===================================================================== */
/*  Avatar — circular (photo or initials stub)                            */
/* ===================================================================== */

export const CemeteryAvatar = styled.div<{ $fallback?: boolean }>`
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -42%);
    width: clamp(${vw(28, 'xs')}, 2vw, ${vw(36, 'xs')});
    height: clamp(${vw(28, 'xs')}, 2vw, ${vw(36, 'xs')});
    border-radius: 50%;
    border: 1px solid ${color('cemeteryBorder')};
    background: ${color('avatarStub')};
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    z-index: 3;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    ${mediaBreakpointUp('lg')} {
        width: clamp(${vw(30)}, 1.75vw, ${vw(36)});
        height: clamp(${vw(30)}, 1.75vw, ${vw(36)});
        transform: translate(-50%, -65%);
    }
`;

export const AvatarInitials = styled.span`
    ${font('label')};
    color: ${color('textPrimary')};
`;

/* ===================================================================== */
/*  Timeline connector (separate element, not part of the card)          */
/* ===================================================================== */

export const TimelineConnector = styled.span<{
    $direction: 'vertical' | 'horizontal';
    $length: number;
}>`
    position: absolute;
    z-index: 1;
    background: ${color('cemeteryGray')};
    pointer-events: none;

    ${({ $direction, $length }) =>
        $direction === 'vertical'
            ? css`
                  left: 50%;
                  top: 100%;
                  width: 1px;
                  height: ${$length}px;
                  transform: translateX(-50%);
              `
            : css`
                  top: 50%;
                  left: ${-$length}px;
                  height: 1px;
                  width: ${$length}px;
                  transform: translateY(-50%);
              `}
`;

/* ===================================================================== */
/*  Cemetery person card moved to PersonNode (PersonNode.styled.tsx) —    */
/*  the memorial card lives inside the shared tree/cemetery component.    */
/* ===================================================================== */

/* ===================================================================== */
/*  Add relative button (reusable, props-driven)                          */
/* ===================================================================== */

export const AddRelativeButton = styled.button`
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    margin: ${vw(10, 'xs')} auto max(${vw(12, 'xs')}, env(safe-area-inset-bottom));
    width: clamp(${vw(220, 'xs')}, 70vw, ${vw(320, 'xs')});
    height: ${vw(50, 'xs')};
    border: none;
    border-radius: 5px;
    background: ${color('meadowBlue')};
    color: ${color('cream')};
    cursor: pointer;
    ${font('button')};
    text-align: center;
    transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        margin: ${vw(12)} auto max(${vw(12)}, env(safe-area-inset-bottom));
        width: clamp(${vw(280)}, 22vw, ${vw(440)});
        height: clamp(${vw(52)}, 3vw, ${vw(64)});
    }

    ${hover(css`
        background: ${color('slateBlue')};
        transform: translateY(-1px);
    `)}

    &:active {
        transform: translateY(0);
    }
`;

export const SearchPopover = styled.form`
    position: absolute;
    top: ${vw(58, 'xs')};
    left: ${vw(16, 'xs')};
    z-index: 8;
    display: flex;
    flex-wrap: wrap;
    gap: ${vw(8, 'xs')};
    width: min(100%, calc(100vw - ${vw(32, 'xs')}));
    max-width: ${vw(320, 'xs')};
    padding: ${vw(10, 'xs')};
    background: ${color('cream')};
    border-radius: ${vw(8, 'xs')};
    box-shadow: 0 ${vw(8, 'xs')} ${vw(24, 'xs')} ${color('forestDeep', 0.2)};
    ${font('mobileControl')};
    color: ${color('mutedText')};

    ${mediaBreakpointUp('lg')} {
        top: ${vw(58)};
        left: ${vw(16)};
        gap: ${vw(8)};
        width: ${vw(320)};
        max-width: none;
        padding: ${vw(10)};
        border-radius: ${vw(8)};
        box-shadow: 0 ${vw(8)} ${vw(24)} ${color('forestDeep', 0.2)};
    }
`;

export const SearchInput = styled.input`
    min-width: 0;
    flex: 1;
    padding: ${vw(9, 'xs')} ${vw(10, 'xs')};
    border: 1px solid ${color('cemeteryGray', 0.45)};
    border-radius: 5px;
    background: ${color('white')};
    color: ${color('mutedText')};
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(9)} ${vw(10)};
    }
`;

export const SearchSubmit = styled.button`
    flex: 0 0 auto;
    padding: ${vw(9, 'xs')} ${vw(12, 'xs')};
    border-radius: 5px;
    background: ${color('meadowBlue')};
    color: ${color('cream')};
    cursor: pointer;
    ${font('mobileAction')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(9)} ${vw(12)};
    }
`;
