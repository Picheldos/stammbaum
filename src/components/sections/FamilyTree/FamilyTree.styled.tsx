import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';

/* ---------- Page-level shell ---------- */

export const TreeRoot = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* MainArea is absolutely positioned and has no intrinsic height. Without
       an explicit viewport height the canvas collapses to the header height,
       and overflow clipping hides the nodes and controls. */
    height: calc(100dvh - 55px);
    min-height: 0;

    overflow: hidden;

    ${mediaBreakpointUp('lg')} {
        height: calc(100dvh - 60px);
    }
`;

export const Backdrop = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: url('/fon.jpg') center / cover no-repeat;
`;

export const Canvas = styled.div`
    position: absolute;
    inset: 0;
    overflow: hidden;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`;

export const TreeImageLayer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    img {
        object-fit: cover;
        pointer-events: none;
    }
`;

export const Scene = styled.div<{ $x: number; $y: number; $scale: number }>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    transform: ${({ $x, $y, $scale }) => `translate(${$x}px, ${$y}px) scale(${$scale})`};
    will-change: transform;
`;

export const ConnectionsSvg = styled.svg<{
    $left: number;
    $top: number;
    $width: number;
    $height: number;
}>`
    position: absolute;
    left: ${({ $left }) => $left}px;
    top: ${({ $top }) => $top}px;
    width: ${({ $width }) => $width}px;
    height: ${({ $height }) => $height}px;
    pointer-events: none;
    overflow: visible;
    z-index: 0;
`;

/* ---------- Controls ---------- */

export const ZoomControls = styled.div`
    position: absolute;
    right: ${vw(16, 'xs')};
    bottom: max(${vw(16, 'xs')}, env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;
    gap: ${vw(8, 'xs')};
    z-index: 5;

    ${mediaBreakpointUp('lg')} {
        right: ${vw(16)};
        bottom: max(${vw(16)}, env(safe-area-inset-bottom));
        gap: ${vw(8)};
    }
`;

export const ZoomButton = styled.button`
    width: ${vw(36, 'xs')};
    height: ${vw(36, 'xs')};
    border-radius: 50%;
    border: none;
    background: ${color('cream')};
    color: ${color('textPrimary')};
    box-shadow: 0 4px ${vw(14, 'xs')} ${color('forestDeep', 0.2)};
    cursor: pointer;
    ${font('bodyLarge')};
    transition: background-color 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        width: ${vw(36)};
        height: ${vw(36)};
        box-shadow: 0 4px ${vw(14)} ${color('forestDeep', 0.2)};
    }

    ${hover(css`
        background: ${color('creamWarm')};
    `)}
`;

export const FloatingTopRight = styled.div`
    position: absolute;
    top: ${vw(16, 'xs')};
    right: ${vw(16, 'xs')};
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    z-index: 6;

    ${mediaBreakpointUp('lg')} {
        top: ${vw(16)};
        right: ${vw(16)};
        gap: ${vw(8)};
    }
`;

export const FloatingTopLeft = styled.div`
    position: absolute;
    top: ${vw(16, 'xs')};
    left: ${vw(16, 'xs')};
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    z-index: 6;

    ${mediaBreakpointUp('lg')} {
        top: ${vw(16)};
        left: ${vw(16)};
        gap: ${vw(8)};
    }
`;

export const IconButton = styled.button`
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
    transition: background-color 0.3s ease-in-out;

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

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
`;

export const AddRelativeCta = styled.button`
    position: absolute;
    left: 50%;
    bottom: max(${vw(24, 'xs')}, calc(env(safe-area-inset-bottom) + ${vw(8, 'xs')}));
    transform: translateX(-50%);
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: ${vw(10, 'xs')};
    padding: ${vw(14, 'xs')} ${vw(32, 'xs')};
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 ${vw(6, 'xs')} ${vw(18, 'xs')} ${color('slateShadow', 0.34)};
    ${font('mobileAction')};
    transition: background-color 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        border-radius: ${vw(10)};
        padding: ${vw(14)} ${vw(32)};
        box-shadow: 0 ${vw(6)} ${vw(18)} ${color('slateShadow', 0.34)};
    }

    ${hover(css`
        background: ${color('slateBlue')};
    `)}

    ${mediaBreakpointDown('md')} {
        bottom: max(${vw(84, 'xs')}, calc(env(safe-area-inset-bottom) + ${vw(68, 'xs')}));
        padding: ${vw(11, 'xs')} ${vw(22, 'xs')};
        white-space: nowrap;
    }
`;

export const SearchPopover = styled.form`
    position: absolute;
    top: ${vw(58, 'xs')};
    left: ${vw(16, 'xs')};
    z-index: 8;
    display: flex;
    gap: ${vw(8, 'xs')};
    width: min(100%, calc(100vw - ${vw(32, 'xs')}));
    max-width: ${vw(320, 'xs')};
    padding: ${vw(10, 'xs')};
    background: ${color('landingCard')};
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
    border: 1px solid ${color('forest', 0.35)};
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
    background: ${color('landingCta')};
    color: ${color('white')};
    cursor: pointer;
    ${font('mobileAction')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(9)} ${vw(12)};
    }
`;

/* ---------- Empty state ---------- */

export const EmptyOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${vw(24, 'xs')};
    z-index: 4;
    pointer-events: none;

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(24)};
    }
`;

export const EmptyCard = styled.button`
    pointer-events: auto;
    background: ${color('warmPaper')};
    color: ${color('textPrimary')};
    border: 1px solid ${color('white', 0.45)};
    padding: ${vw(16, 'xs')} ${vw(24, 'xs')};
    border-radius: ${vw(8, 'xs')};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${vw(12, 'xs')};
    box-shadow: 0 ${vw(8, 'xs')} ${vw(24, 'xs')} ${color('forestDeep', 0.18)};
    cursor: pointer;
    ${font('mobileBody')};
    min-width: ${vw(220, 'xs')};
    text-align: center;
    transition: background-color 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(16)} ${vw(24)};
        border-radius: ${vw(8)};
        gap: ${vw(12)};
        box-shadow: 0 ${vw(8)} ${vw(24)} ${color('forestDeep', 0.18)};
        min-width: ${vw(220)};
    }

    ${hover(css`
        background: ${color('creamWarm')};
    `)}
`;

export const EmptyAvatar = styled.div`
    width: ${vw(44, 'xs')};
    height: ${vw(44, 'xs')};
    border-radius: 50%;
    background: ${color('avatarStub')};
    margin-bottom: ${vw(6, 'xs')};
    box-shadow: inset 0 1px 3px ${color('black', 0.08)};

    ${mediaBreakpointUp('lg')} {
        width: ${vw(44)};
        height: ${vw(44)};
        margin-bottom: ${vw(6)};
    }
`;

export const EmptyCta = styled.button`
    pointer-events: auto;
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: ${vw(10, 'xs')};
    padding: ${vw(14, 'xs')} ${vw(28, 'xs')};
    cursor: pointer;
    box-shadow: 0 ${vw(6, 'xs')} ${vw(18, 'xs')} ${color('slateShadow', 0.34)};
    ${font('mobileAction')};
    transition: background-color 0.3s ease-in-out;

    ${mediaBreakpointUp('lg')} {
        border-radius: ${vw(10)};
        padding: ${vw(14)} ${vw(28)};
        box-shadow: 0 ${vw(6)} ${vw(18)} ${color('slateShadow', 0.34)};
    }

    ${hover(css`
        background: ${color('slateBlue')};
    `)}
`;
