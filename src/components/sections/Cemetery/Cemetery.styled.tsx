import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vh, vw } from '@/style/mixins';
import { TIMELINE_AXIS_LEFT } from './cemeteryUtils';

/* ===================================================================== */
/*  Page shell — sits inside Layout > MainArea                            */
/* ===================================================================== */

/** Full viewport slice below the header. `--vh` is set by useResize.
 *  Flex column: nav rail on top, scrollable timeline in the middle
 *  (fills / centers the remaining slice), add-button pinned to the bottom.
 *  Height is always one full viewport minus the sticky header height
 *  (55 px on mobile, 60 px from lg up). */
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
        padding-top: 8px;
    }

    ${mediaBreakpointUp('lg')} {
        padding: 0 20px;
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
`;

/* ===================================================================== */
/*  Period navigation rail (sticky on mobile)                           */
/* ===================================================================== */

export const PeriodNavRail = styled.nav`
    position: relative;
    z-index: 2;
    margin-bottom: ${vh(8)};

    ${mediaBreakpointDown('md')} {
        position: sticky;
        top: 43px;
        margin-top: 0;
        margin-bottom: 12px;
        padding: 8px;
        background: ${color('cream')};
        border-bottom: 1px solid ${color('cemeteryGray', 0.16)};
    }
`;

export const PeriodChipRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${vw(12, 'xs')};

    ${mediaBreakpointDown('md')} {
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 6px;

        &::after {
            content: '';
            display: inline-block;
            width: 8px;
        }
    }

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(16, 'mac')};
    }
`;

/* ===================================================================== */
/*  Floating controls (search / menu) — same layout as the Family tree    */
/* ===================================================================== */

export const FloatingTopLeft = styled.div`
    position: absolute;
    top: -20px;
    right: 50px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 6;
`;

export const FloatingTopRight = styled.div`
    position: absolute;
    top: -20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 6;
`;

export const FloatingIconButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: ${color('textPrimary')};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 22px;
        height: 22px;
    }

    ${hover(css`
        background: rgba(255, 255, 255, 0.4);
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
    scroll-behavior: smooth;
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
        gap: ${vw(8, 'xs')};
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
    margin-top: ${vw(4, 'xs')};
    ${font('font4')};
    font-weight: 500;
    color: ${color('cemeteryGray')};
    line-height: 1.1;
    white-space: nowrap;

    ${mediaBreakpointUp('md')} {
        margin-top: 6px;
    }
`;

export const DeathYearLabel = styled.span<{ $mobile: boolean; $axisPos: number }>`
    position: absolute;
    z-index: 2;
    font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
    font-size: 10px;
    font-weight: 500;
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
/*  Period chip — slanted "arrow" sides via clip-path (not a plain       */
/*  rounded rectangle). Reproduces Figma Rectangle 69/72/77 shape.        */
/* ===================================================================== */

export const PeriodChip = styled.button<{ $active?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    ${font('font3')};
    line-height: 1.1;
    font-weight: 500;
    text-align: center;
    color: ${color('ink')};
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    outline: none;
    /* arrow-sided hexagon: left & right edges come to a point */
    clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%);
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

    width: clamp(132px, 7vw, 166px);
    height: clamp(44px, 2.9vw, 55px);

    ${({ $active }) =>
        $active
            ? css`
                  background: ${color('meadowBlue')};
                  color: ${color('cream')};
                  border-color: ${color('meadowBlue')};
              `
            : css`
                  background: transparent;
                  color: ${color('ink')};
                  border-color: ${color('ink', 0.5)};
              `}

    ${hover(css`
        transform: translateY(-1px);
    `)}

    &:active {
        transform: translateY(0);
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
    width: clamp(28px, 2vw, 36px);
    height: clamp(28px, 2vw, 36px);
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
        width: clamp(30px, 1.75vw, 36px);
        height: clamp(30px, 1.75vw, 36px);
        transform: translate(-50%, -46%);
    }
`;

export const AvatarInitials = styled.span`
    font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
    font-size: clamp(10px, 2vw, 13px);
    font-weight: 600;
    line-height: 1;
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
    margin: ${vh(30)} auto 0;
    width: clamp(280px, 22vw, 440px);
    height: clamp(52px, 3vw, 64px);
    border: none;
    border-radius: 5px;
    background: ${color('meadowBlue')};
    color: ${color('cream')};
    cursor: pointer;
    ${font('font3')};
    font-weight: 500;
    text-align: center;
    transition: background-color 0.2s ease, transform 0.15s ease;

    ${hover(css`
        background: ${color('slateBlue')};
        transform: translateY(-1px);
    `)}

    &:active {
        transform: translateY(0);
    }

    ${mediaBreakpointDown('lg')} {
        width: clamp(220px, 70vw, 320px);
        height: clamp(44px, 3vw, 50px);
    }
`;
