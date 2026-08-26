import { color, font, mediaBreakpointDown, mediaBreakpointUp, vh, vw } from '@/style/mixins';
import styled from 'styled-components';

export const LandingRoot = styled.section`
    width: 100%;
    padding-top: ${vw(60, 'xs')};

    ${mediaBreakpointUp('lg')} {
        padding-top: ${vw(40, 'xl')};
        height: calc(100vh - 60px - ${vw(40)});
    }
`;

export const HeroGrid = styled.div`
    display: grid;
    align-items: start;

    ${mediaBreakpointUp('lg')} {
        grid-template-columns: minmax(0, 1fr) minmax(280px, 1.08fr);
        align-items: center;
        height: 100%;

        & > button {
            display: none;
        }
    }
`;

export const HeroContent = styled.div`
    display: flex;
    flex-direction: column;

    height: 100%;
    justify-content: space-between;

    button {
        ${mediaBreakpointDown('xl')} {
            display: none;
        }
    }
`;

/* заголовок — типография из общего набора */
export const HeroTitle = styled.h1`
    ${font('title')};
    color: ${color('textPrimary')};
    max-width: ${vw(250, 'xs')};

    line-height: 0.92;

    ${mediaBreakpointUp('lg')} {
        max-width: ${vw(920)};
    }
`;

export const StepsList = styled.ol`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    ${mediaBreakpointDown('md')} {
        max-width: ${vw(300, 'xs')};
        margin-top: ${vw(40, 'xs')};
    }
`;

export const StepItem = styled.li`
    display: flex;
    flex-direction: row;
    gap: clamp(0.65rem, 2vw, 1rem);
    align-items: center;
    color: ${color('textPrimary')};

    text-align: left;

    ${font('font6')};

    &:not(:last-of-type) {
        margin-bottom: ${vw(20, 'xs')};
    }

    ${mediaBreakpointUp('xl')} {
        text-align: auto;
        &:not(:last-of-type) {
            margin-bottom: ${vw(40)};
        }
    }
`;

export const StepIndex = styled.span`
    flex-shrink: 0;
    min-width: 2.85rem;
    ${font('stepIndex')};
    font-weight: 300;
    line-height: 1.08;
    color: ${color('landingStepNum')};

    ${mediaBreakpointUp('xl')} {
        ${font('title')};
    }
`;

export const StepCopy = styled.span`
    flex: 1;
    ${font('font3')};
    font-weight: 400;

    ${mediaBreakpointUp('xl')} {
        line-height: 1.45;
    }
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
        margin-top: ${vw(30, 'xs')};
    }
`;

export const TreeScene = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    ${mediaBreakpointDown('lg')} {
        margin-top: ${vw(60, 'xs')};
    }
`;

export const TreeLayer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 0;

    width: 100%;
    height: ${vw(330, 'xs')};

    ${mediaBreakpointDown('lg')} {
        flex: unset;
        order: 2;
        padding-bottom: 0;
    }

    ${mediaBreakpointUp('lg')} {
        inset: auto 0 0;
        justify-content: flex-end;
        pointer-events: none;
        position: absolute;

        width: ${vw(585, 'xl')};
        height: ${vh(946)};
        inset: auto 0 calc(0px - 60px - ${vw(40)});
    }

    /* ${mediaBreakpointUp('xxl')} {
        inset: auto 0 calc(0 - 60px - ${vw(40, 'xl')});;
    } */
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
