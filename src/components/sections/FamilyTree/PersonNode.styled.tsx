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
 * ≥ lg the card is vw-scaled against the FHD reference width.
 */
export const NodeCard = styled.button<{ $hidden?: boolean }>`
    pointer-events: auto;
    position: relative;
    width: ${vw(89.6, 'xs')};
    height: fit-content;
    padding: ${vw(13.653, 'xs')} ${vw(13.653, 'xs')} ${vw(13.653, 'xs')};
    padding-top: ${vw(47.787, 'xs')};
    margin: 0;
    border-radius: ${vw(10.24, 'xs')};
    background: ${color('landingCard')};
    box-shadow: 0 ${vw(5.12, 'xs')} ${vw(15.36, 'xs')} ${color('forestDeep', 0.12)};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${vw(5.12, 'xs')};
    color: ${color('textPrimary')};
    border: 1px solid ${color('ink', 0.75)};
    opacity: ${({ $hidden }) => ($hidden ? 0.45 : 1)};
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    cursor: pointer;
 
    ${font('personName')};
 
    ${mediaBreakpointUp('md')} {
        width: ${vw(180, 'md')};
        padding: ${vw(16, 'md')} ${vw(16, 'md')} ${vw(16, 'md')};
        padding-top: ${vw(56, 'md')};
        border-radius: ${vw(12, 'md')};
        box-shadow: 0 ${vw(6, 'md')} ${vw(18, 'md')} ${color('forestDeep', 0.12)};
        gap: ${vw(6, 'md')};
    }
 
    ${mediaBreakpointUp('lg')} {
        width: ${vw(125)};
        height: ${vw(50)};
        padding: ${vw(12)};
        border-radius: 5px;
        box-shadow: 0 ${vw(6)} ${vw(18)} ${color('forestDeep', 0.12)};
        gap: 5px;
    }

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(13)};
    }

    @media (min-width: 1440px) {
        width: ${vw(105)};
        height: ${vw(66)};
        padding: ${vw(10)};
    }

    ${hover(css`
        box-shadow: 0 ${vw(10)} ${vw(24)} ${color('forestDeep', 0.26)};
    `)}
`;
 
/**
 * Floating avatar — mirrors `PersonCard.AvatarStub`. At xs/md it overhangs the
 * card from above (`top: -35`); at ≥ lg it pins to the top-left of the card
 * with a small upward overhang (`top: -12.5`), matching the PersonCard design.
 */
export const NodeAvatar = styled.div<{ $photo?: string }>`
    width: ${vw(34.133, 'xs')};
    height: ${vw(34.133, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: ${vw(1.707, 'xs')} solid ${color('white', 0.75)};
    box-shadow: 0 ${vw(0.853, 'xs')} ${vw(2.56, 'xs')} ${color('black', 0.18)}, inset 0 ${vw(0.427, 'xs')} ${vw(1.28, 'xs')} ${color('black', 0.08)};
    position: absolute;
    top: ${vw(-17.067, 'xs')};
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    pointer-events: none;
 
    &::after {
        content: '';
        position: absolute;
        inset: ${vw(11.947, 'xs')} ${vw(13.653, 'xs')};
        border-radius: 50% 50% 40% 40%;
        background: ${color('white', 0.22)};
    }
 
    ${mediaBreakpointUp('md')} {
        width: ${vw(70, 'md')};
        height: ${vw(70, 'md')};
        border: ${vw(4, 'md')} solid ${color('white', 0.75)};
        box-shadow: 0 ${vw(2, 'md')} ${vw(6, 'md')} ${color('black', 0.18)}, inset 0 ${vw(1, 'md')} ${vw(3, 'md')} ${color('black', 0.08)};
        top: ${vw(-35, 'md')};
 
        &::after {
            inset: ${vw(14, 'md')} ${vw(16, 'md')};
        }
    }
 
    ${mediaBreakpointUp('lg')} {
        width: ${vw(25)};
        height: ${vw(25)};
        border: 1px solid ${color('ink', 0.75)};
        top: ${vw(-12.5)};
        left: auto;
        transform: none;
        z-index: auto;
 
        &::after {
            inset: ${vw(10)} ${vw(12)};
        }
    }
`;
 
/** Relation line — mirrors `PersonCard.MetaLine`. */
export const NodeRelation = styled.span`
    ${font('personNameStrong')};
`;

/**
 * Name line — equivalent to PersonCard's plain `<span>` between MetaLine and
 * LifespanLine. Inherits its family from the parent card.
 */
export const NodeName = styled.span`
    ${font('personName')};
    line-height: 1.366;
`;

/** Lifespan line — mirrors `PersonCard.LifespanLine`. */
export const NodeMeta = styled.span`
    ${font('personLifespan')};
    opacity: 0.72;
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
    border-radius: 5px;
    background: ${color('cemeteryGray')};
    color: ${color('cream')};
    border: none;
    transition: box-shadow 0.3s ease-in-out;
    cursor: pointer;

    /* Search-match glow (mirrors the tree page search behavior). */
    ${({ $highlighted }) =>
        $highlighted &&
        css`
            z-index: 2;
            box-shadow: 0 0 0 3px ${color('cream')}, 0 0 ${vw(22)} ${color('white', 0.55)};
        `}

    &:hover {
        ${hover(css`
            box-shadow: 0 0 ${vw(14)} ${color('cream', 0.3)};
        `)}
    }

    width: clamp(${vw(124, 'xs')}, 7.8vw, ${vw(132, 'xs')});
    height: fit-content;
    min-height: ${vw(64, 'xs')};

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

    ${mediaBreakpointUp('lg')} {
        width: clamp(${vw(140)}, 7.8vw, ${vw(150)});
        height: clamp(${vw(64)}, 3.7vw, ${vw(70)});
        min-height: 0;
    }

    ${mediaBreakpointUp('xl')} {
        border: 1px solid ${color('cemeteryBorderAlt')}; /* 1200 tablet tint */
    }

    ${mediaBreakpointUp('xxl')} {
        border: none;
    }

    ${mediaBreakpointDown('md')} {
        width: min(${vw(132, 'xs')}, calc(100vw - ${vw(32, 'xs')}));
        padding: ${vw(42, 'xs')} ${vw(10, 'xs')} ${vw(10, 'xs')};
        gap: 4px;
        border-radius: ${vw(8, 'xs')};
    }

    ${mediaBreakpointDown('xs')} {
        width: min(${vw(124, 'xs')}, calc(100vw - ${vw(28, 'xs')}));
    }
`;

export const CemeteryNodeRelation = styled.span`
    ${font('personMetaStrong')};
    color: ${color('cream')};

    ${mediaBreakpointUp('lg')} {
        margin-top: ${vw(14)};
    }
`;

export const CemeteryNodeName = styled.span`
    ${font('personName')};
    color: ${color('cream')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;

    ${mediaBreakpointUp('lg')} {
        margin-top: ${vw(12)};
    }
`;

export const CemeteryNodeMeta = styled.span`
    ${font('personMeta')};
    color: ${color('cream')};
    opacity: 0.92;

    ${mediaBreakpointUp('lg')} {
        margin-top: ${vw(12)};
    }
`;
