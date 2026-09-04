import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';
import {
    CARD_GAP,
    CARD_STACK_DESKTOP,
    CARD_STACK_MOBILE,
    LINE_BOTTOM_OFFSET,
    TIMELINE_AXIS_LEFT
} from '../Cemetery/cemeteryUtils';
 
/**
 * Invisible bounding box that matches the layout slot (nodeWidth × nodeHeight
 * from `DEFAULT_LAYOUT_OPTIONS`). Connection lines are computed in `layout.ts`
 * against these slot dimensions, so the wrapper must keep them.
 *
 * The visible card inside is bottom-anchored (`align-items: flex-end`) so its
 * bottom edge stays exactly at the slot bottom — i.e. where the line endpoints
 * for parent→child connections meet the card. The wrapper itself is
 * non-interactive (`pointer-events: none`) so empty space inside the slot
 * passes the click through to the canvas drag handler; only the visible card
 * captures pointer events.
 */
export const NodeWrapper = styled.div<{ $x: number; $y: number; $width: number; $height: number }>`
    position: absolute;
    transform: translate(${({ $x }) => $x}px, ${({ $y }) => $y}px);
    width: ${({ $width }) => $width}px;
    height: ${({ $height }) => $height}px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
    z-index: 2;
`;
 
/**
 * Visible card — mirrors `PersonCard.Container` from
 * `src/components/blocks/PersonCard/PersonCard.styled.tsx` so the in-tree card
 * has identical layout, typography and dimensions at every breakpoint. At
 * ≥ lg the card is 105 × 50 (vw-scaled against the xl viewport of 1200px).
 */
export const NodeCard = styled.button<{ $hidden?: boolean }>`
    pointer-events: auto;
    position: relative;
    width: ${vw(105, 'xs')};
    height: fit-content;
    padding: ${vw(16, 'xs')} ${vw(16, 'xs')} ${vw(16, 'xs')};
    padding-top: ${vw(56, 'xs')};
    margin: 0;
    border-radius: ${vw(12, 'xs')};
    background: ${color('landingCard')};
    box-shadow: 0 ${vw(6, 'xs')} ${vw(18, 'xs')} rgba(47, 79, 58, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${vw(6, 'xs')};
    color: ${color('textPrimary')};
    border: 1px solid rgba(48, 48, 42, 0.75);
    opacity: ${({ $hidden }) => ($hidden ? 0.45 : 1)};
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    cursor: pointer;
 
    ${font('font8')};
 
    ${mediaBreakpointUp('md')} {
        width: ${vw(180, 'md')};
        padding: ${vw(16, 'md')} ${vw(16, 'md')} ${vw(16, 'md')};
        padding-top: ${vw(56, 'md')};
        border-radius: ${vw(12, 'md')};
        box-shadow: 0 ${vw(6, 'md')} ${vw(18, 'md')} rgba(47, 79, 58, 0.12);
        gap: ${vw(6, 'md')};
    }
 
    ${mediaBreakpointUp('lg')} {
        width: ${vw(125, 'xl')};
        height: ${vw(50, 'xl')};
        padding: ${vw(12, 'xl')};
        border-radius: 5px;
        box-shadow: 0 6px 18px rgba(47, 79, 58, 0.12);
        gap: 5px;
    }

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(13, 'xl')};
    }
 
    ${hover(css`
        box-shadow: 0 10px 24px rgba(47, 79, 58, 0.26);
    `)}
`;
 
/**
 * Floating avatar — mirrors `PersonCard.AvatarStub`. At xs/md it overhangs the
 * card from above (`top: -35`); at ≥ lg it pins to the top-left of the card
 * with a small upward overhang (`top: -12.5`), matching the PersonCard design.
 */
export const NodeAvatar = styled.div<{ $photo?: string }>`
    width: ${vw(40, 'xs')};
    height: ${vw(40, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: ${vw(2, 'xs')} solid rgba(255, 255, 255, 0.75);
    box-shadow: 0 ${vw(1, 'xs')} ${vw(3, 'xs')} rgba(0, 0, 0, 0.18), inset 0 ${vw(0.5, 'xs')} ${vw(1.5, 'xs')} rgba(0, 0, 0, 0.08);
    position: absolute;
    top: ${vw(-20, 'xs')};
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    pointer-events: none;
 
    &::after {
        content: '';
        position: absolute;
        inset: ${vw(14, 'xs')} ${vw(16, 'xs')};
        border-radius: 50% 50% 40% 40%;
        background: rgba(255, 255, 255, 0.22);
    }
 
    ${mediaBreakpointUp('md')} {
        width: ${vw(70, 'md')};
        height: ${vw(70, 'md')};
        border: ${vw(4, 'md')} solid rgba(255, 255, 255, 0.75);
        box-shadow: 0 ${vw(2, 'md')} ${vw(6, 'md')} rgba(0, 0, 0, 0.18), inset 0 ${vw(1, 'md')} ${vw(3, 'md')} rgba(0, 0, 0, 0.08);
        top: ${vw(-35, 'md')};
 
        &::after {
            inset: ${vw(14, 'md')} ${vw(16, 'md')};
        }
    }
 
    ${mediaBreakpointUp('lg')} {
        width: ${vw(25, 'xl')};
        height: ${vw(25, 'xl')};
        border: 1px solid rgba(48, 48, 42, 0.75);
        top: ${vw(-12.5, 'xl')};
        left: auto;
        transform: none;
        z-index: auto;
 
        &::after {
            inset: 10px 12px;
        }
    }
`;
 
/** Relation line — mirrors `PersonCard.MetaLine`. */
export const NodeRelation = styled.span`
    ${font('font9')};
    font-weight: 500;
    opacity: 0.78;
    line-height: 1.2;
`;
 
/**
 * Name line — equivalent to PersonCard's plain `<span>` between MetaLine and
 * LifespanLine. Inherits `font8` from the parent `NodeCard`.
 */
export const NodeName = styled.span``;
 
/** Lifespan line — mirrors `PersonCard.LifespanLine`. */
export const NodeMeta = styled.span`
    font-size: 5px !important;
    opacity: 0.72;
    line-height: 1.25;
`;
/* ===================================================================== */
/*  Cemetery variant — memorial card (moved from Cemetery.styled)         */
/* ===================================================================== */

/**
 * Memorial card on the virtual-cemetery timeline. Sits absolutely on the
 * track, anchored to the timeline axis via `$row`/`$axisPos` (bottom-anchored
 * on desktop, stacked beside the axis on mobile). Uses the museum-gray
 * cemetery palette (`cemeteryGray` + `cream`) so it reads as a different page
 * object than the warm paper in-tree card.
 */
export const CemeteryNodeCard = styled.div<{
    $row: number;
    $axisPos: number;
    $isDesktop: boolean;
    $highlighted?: boolean;
}>`
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
    transition: box-shadow 0.3s ease;

    /* Search-match glow (mirrors the tree page search behavior). */
    ${({ $highlighted }) =>
        $highlighted &&
        css`
            z-index: 2;
            box-shadow: 0 0 0 3px ${color('cream')}, 0 0 22px rgba(255, 255, 255, 0.55);
        `}

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

export const CemeteryNodeRelation = styled.span`
    ${font('font9')};
    font-weight: 600;
    color: ${color('cream')};
    line-height: 1.1;
`;

export const CemeteryNodeName = styled.span`
    ${font('font8')};
    font-weight: 400;
    color: ${color('cream')};
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
`;

export const CemeteryNodeMeta = styled.span`
    font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
    font-size: clamp(6px, 0.5vw, 8px);
    font-weight: 500;
    line-height: 1.1;
    color: ${color('cream')};
    opacity: 0.92;
`;