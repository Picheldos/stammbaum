import styled from 'styled-components';
import { color, mediaBreakpointDown, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const LandingRoot = styled.section`
    width: 100%;
    height: 100%;
    padding: ${vw(40, 'xl')} 0;
`;

export const HeroGrid = styled.div`
    display: grid;
    align-items: start;

    ${mediaBreakpointUp('lg')} {
        grid-template-columns: minmax(0, 1fr) minmax(280px, 1.08fr);
        align-items: center;
    }   
`;

export const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(12rem, 3.5vw, 2.5rem);
    max-width: 36rem;

    ${mediaBreakpointDown('md')} {
        max-width: none;
        text-align: center;
        align-items: center;
    }
`;

/* заголовок — типография из общего набора */
export const HeroTitle = styled.h1`
    ${font('title')};
    line-height: 1.22;
    letter-spacing: -0.015em;
    color: ${color('textPrimary')};
`;

export const StepsList = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: clamp(0.95rem, 2.2vw, 1.25rem);

    ${mediaBreakpointDown('md')} {
        max-width: 28rem;
    }
`;

export const StepItem = styled.li`
    display: flex;
    flex-direction: row;
    gap: clamp(0.65rem, 2vw, 1rem);
    align-items: flex-start;
    color: ${color('textPrimary')};

    ${mediaBreakpointDown('md')} {
        text-align: left;
    }
`;

export const StepIndex = styled.span`
    flex-shrink: 0;
    min-width: 2.85rem;
    ${font('title2')};
    font-weight: 300;
    line-height: 1.08;
    color: ${color('landingStepNum')};

    ${mediaBreakpointUp('xl')} {
        ${font('title')};
    }
`;

export const StepCopy = styled.span`
    flex: 1;
    padding-top: 0.65rem;
    ${font('font3')};
    line-height: 1.45;
    font-weight: 400;
`;

export const CtaButton = styled.button`
    align-self: flex-start;
    width: 100%;
    max-width: 18.5rem;
    padding: 0.9rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    color: ${color('white')};
    background: ${color('landingCta')};
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(94, 109, 139, 0.28);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

    &:hover {
        background: ${color('slateBlue')};
        box-shadow: 0 6px 20px rgba(94, 109, 139, 0.34);
    }

    &:active {
        transform: translateY(1px);
    }

    &:focus-visible {
        outline: 3px solid ${color('forest')};
        outline-offset: 3px;
    }

    ${mediaBreakpointDown('md')} {
        align-self: stretch;
        max-width: none;
    }
`;

export const TreeScene = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: min(560px, 72vh);

    ${mediaBreakpointDown('lg')} {
        min-height: unset;
        gap: 0;
    }
`;

export const TreeLayer = styled.div`
    position: absolute;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 0;

    ${mediaBreakpointDown('lg')} {
        flex: unset;
        order: 2;
        padding-bottom: 0;
    }

    ${mediaBreakpointUp('lg')} {
        inset: auto 0 0;
        justify-content: flex-end;
        pointer-events: none;

        width: ${vw(585, 'xl')};
        height: ${vw(554, 'xl')};
    }

    ${mediaBreakpointUp('xxl')} {
        inset: auto 0 ${vw(-170)};
    }

    
`;

export const CardsOverlay = styled.div`
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: ${vw(145, 'xl')};
    pointer-events: none;
    gap: clamp(14px, 2.8vh, 28px);
    z-index: 1;

    ${mediaBreakpointDown('lg')} {
        position: static;
        inset: unset;
        order: 3;
        padding: 20px 0 0;
        gap: 16px;
        pointer-events: auto;
        align-items: center;
        flex-grow: 0;
        margin-bottom: 8px;
    }
`;

export const CardTier = styled.div<{ $compact?: boolean }>`
    display: flex;
    justify-content: center;
    gap: ${({ $compact }) => ($compact ? 'clamp(8px, 2vw, 16px)' : 'clamp(10px, 2vw, 32px)')};
    flex-wrap: wrap;
    width: 100%;
`;

