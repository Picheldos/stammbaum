import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vh, vw } from '@/style/mixins';
import {
    CARD_GAP,
    CARD_STACK_DESKTOP,
    CARD_STACK_MOBILE,
    LINE_BOTTOM_OFFSET,
    TIMELINE_AXIS_LEFT
} from './cemeteryUtils';

/* ===================================================================== */
/*  Page shell — sits inside Layout > MainArea                            */
/* ===================================================================== */

/** Full viewport slice below the header. `--vh` is set by useResize.
 *  Flex column: nav rail on top, scrollable timeline in the middle
 *  (fills / centers the remaining slice), add-button pinned to the bottom.
 *  Desktop keeps `min-height` only — the timeline is never height-capped. */
export const CemeterySection = styled.section`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(var(--vh, 1vh) * 100 - 60px);
    padding: 0;

    ${mediaBreakpointDown('lg')} {
        height: calc(var(--vh, 1vh) * 100 - 35px);
        overflow: hidden;
        padding-top: 8px;
    }

    ${mediaBreakpointUp('lg')} {
        padding: 0 20px;
    }
`;

/** Retro/Scandinavian meadow backdrop. Opacity is kept low so the timeline
 *  stays readable — the field is decorative only. */
export const PageBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.5;
    background: url('/images/cemetery/meadow.svg') center center / cover no-repeat;
    z-index: -1;
    pointer-events: none;
`;

/* ===================================================================== */
/*  Period navigation rail (sticky on mobile)                           */
/* ===================================================================== */

export const PeriodNavRail = styled.nav`
    position: relative;
    z-index: 2;
    margin-top: ${vh(49)}; /* ~109px from viewport top on FHD */
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

export const PeriodNavTools = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(12, 'xs')};
    margin-left: ${vw(12, 'xs')};

    ${mediaBreakpointUp('lg')} {
        margin-left: ${vw(24, 'mac')};
    }
`;

export const PeriodInputWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: ${vw(192, 'xs')};
    height: ${vw(50, 'xs')};
    border: 1px solid ${color('ink', 0.5)};
    border-radius: 5px;
    background: ${color('cream')};
    padding: 0 ${vw(10, 'xs')};

    ${mediaBreakpointUp('xl')} {
        width: ${vw(192, 'xl')};
        height: ${vw(50, 'xl')};
    }
`;

export const PeriodInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    ${font('font4')};
    color: ${color('ink', 0.5)};

    &::placeholder {
        color: ${color('ink', 0.5)};
    }

    ${mediaBreakpointUp('xl')} {
        font-size: ${vw(14, 'xl')};
    }
`;

export const PeriodInputArrow = styled.svg`
    flex-shrink: 0;
    width: ${vw(16, 'xs')};
    height: ${vw(16, 'xs')};
    margin-left: ${vw(8, 'xs')};
    color: inherit;

    &.clickable {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        width: ${vw(16, 'xl')};
        height: ${vw(16, 'xl')};
    }
`;

export const NavIconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${vw(44, 'xs')};
    height: ${vw(44, 'xs')};
    border: none;
    border-radius: 5px;
    background: transparent;
    color: ${color('ink')};
    cursor: pointer;

    svg {
        width: ${vw(22, 'xs')};
        height: ${vw(22, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(56, 'xl')};
        height: ${vw(56, 'xl')};

        svg {
            width: ${vw(28, 'xl')};
            height: ${vw(28, 'xl')};
        }
    }
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
/*  Cemetery person card (also the positioned anchor for the connector) */
/* ===================================================================== */

export const CemeteryPersonCard = styled.div<{ $row: number; $axisPos: number; $isDesktop: boolean }>`
    position: absolute;
    transform: translateX(-50%);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${vw(4, 'xs')};
    padding: ${vw(10, 'xs')} ${vw(10, 'xs')} ${vw(22, 'xs')};
    border-radius: 5px;
    background: ${color('cemeteryGray')};
    color: ${color('cream')};
    border: none;

    /* desktop FHD: ~150 x 70 */
    width: clamp(140px, 7.8vw, 150px);
    height: clamp(64px, 3.7vw, 70px);

    ${({ $isDesktop, $row, $axisPos }) =>
        $isDesktop
            ? css`
                  left: ${$axisPos}px;
                  bottom: ${LINE_BOTTOM_OFFSET + ($row + 1) * CARD_STACK_DESKTOP}px;
              `
            : css`
                  top: ${$axisPos}px;
                  left: calc(${TIMELINE_AXIS_LEFT}px + ${CARD_GAP}px + ${$row * CARD_STACK_MOBILE}px);
                  transform: translateY(-50%);
              `}

    ${mediaBreakpointUp('xl')} {
        border: 1px solid ${color('cemeteryBorderAlt')}; /* 1200 tablet tint */
    }

    ${mediaBreakpointUp('xxl')} {
        border: none;
    }

    ${mediaBreakpointDown('md')} {
        width: min(140px, calc(100vw - 200px));
        height: auto;
        min-height: ${vw(56, 'xs')};
        padding: ${vw(12, 'xs')};
        padding-top: ${vw(42, 'xs')};
    }
`;

export const CardRelation = styled.span`
    ${font('font9')};
    font-weight: 600;
    color: ${color('cream')};
    line-height: 1.1;
`;

export const CardName = styled.span`
    ${font('font8')};
    font-weight: 400;
    color: ${color('cream')};
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
`;

export const CardDate = styled.span`
    font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
    font-size: clamp(6px, 0.5vw, 8px);
    font-weight: 500;
    line-height: 1.1;
    color: ${color('cream')};
    opacity: 0.92;
`;

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
