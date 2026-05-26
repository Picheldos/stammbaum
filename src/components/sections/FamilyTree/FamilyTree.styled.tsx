import styled, { css } from 'styled-components';
import { color, font, hover } from '@/style/mixins';

/* ---------- Page-level shell ---------- */

export const TreeRoot = styled.section`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    overflow: hidden;
`;

export const Backdrop = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url('/fon.jpg') center / cover no-repeat;
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
`;

export const Scene = styled.div<{ $x: number; $y: number; $scale: number }>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    transform: ${({ $x, $y, $scale }) => `translate(${$x}px, ${$y}px) scale(${$scale})`};
    will-change: transform;
`;

export const ConnectionsSvg = styled.svg`
    position: absolute;
    pointer-events: none;
    overflow: visible;
    z-index: 0;
`;

/* ---------- Controls ---------- */

export const ZoomControls = styled.div`
    position: absolute;
    right: 16px;
    bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 5;
`;

export const ZoomButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: ${color('cream')};
    color: ${color('textPrimary')};
    box-shadow: 0 4px 14px rgba(47, 79, 58, 0.2);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;

    ${hover(css`
        background: ${color('creamWarm')};
    `)}
`;

export const FloatingTopRight = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 6;
`;

export const FloatingTopLeft = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 6;
`;

export const IconButton = styled.button`
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

export const AddRelativeCta = styled.button`
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: 10px;
    padding: 14px 32px;
    font-weight: 600;
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 6px 18px rgba(94, 109, 139, 0.34);
    ${font('font7')};

    ${hover(css`
        background: ${color('slateBlue')};
    `)}
`;

/* ---------- Empty state ---------- */

export const EmptyOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    z-index: 4;
    pointer-events: none;
`;

export const EmptyCard = styled.button`
    pointer-events: auto;
    background: #ecd9bf;
    color: ${color('textPrimary')};
    border: 1px solid rgba(255, 255, 255, 0.45);
    padding: 16px 24px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 24px rgba(47, 79, 58, 0.18);
    cursor: pointer;
    ${font('font2')};
    font-weight: 600;
    min-width: 220px;
    text-align: center;

    ${hover(css`
        background: ${color('creamWarm')};
    `)}
`;

export const EmptyAvatar = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${color('avatarStub')};
    margin-bottom: 6px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
`;

export const EmptyCta = styled.button`
    pointer-events: auto;
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: 10px;
    padding: 14px 28px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(94, 109, 139, 0.34);
    ${font('font7')};

    ${hover(css`
        background: ${color('slateBlue')};
    `)}
`;
