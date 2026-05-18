import styled from 'styled-components';
import { color, mediaBreakpointDown, mediaBreakpointUp } from '@/style/mixins';
import { remFluidMiddle } from '@/style/typography';

export const LandingRoot = styled.section`
    width: 100%;
    padding: clamp(1.75rem, 4vw, 3.25rem) 0 clamp(2.5rem, 6vw, 4rem);
`;

export const HeroGrid = styled.div`
    display: grid;
    gap: clamp(2rem, 5vw, 3.75rem);
    align-items: start;

    ${mediaBreakpointUp('lg')} {
        grid-template-columns: minmax(0, 1fr) minmax(280px, 1.08fr);
        align-items: center;
    }
`;

export const HeroContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.5vw, 2.5rem);
    max-width: 36rem;

    ${mediaBreakpointDown('md')} {
        max-width: none;
        text-align: center;
        align-items: center;
    }
`;

export const HeroTitle = styled.h1`
    ${remFluidMiddle('font-size', 26, 30, 36, 42)};
    line-height: 1.22;
    font-weight: 700;
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
    font-size: clamp(1.75rem, 3.8vw, 2.65rem);
    font-weight: 300;
    line-height: 1.08;
    color: ${color('landingStepNum')};
`;

export const StepCopy = styled.span`
    flex: 1;
    padding-top: 0.65rem;
    font-size: clamp(0.95rem, 1.85vw, 1.0625rem);
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
        position: absolute;
        inset: auto 0 0;
        justify-content: flex-end;
        padding-bottom: 2%;
        pointer-events: none;
    }
`;

export const CardsOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: clamp(12px, 3vh, 32px);
    padding-bottom: 8%;
    pointer-events: none;
    gap: clamp(14px, 2.8vh, 28px);

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

export const DemoCardRoot = styled.div`
    pointer-events: auto;
    width: clamp(118px, 19vw, 158px);
    padding: 10px 10px 12px;
    border-radius: 10px;
    background: ${color('landingCard')};
    box-shadow: 0 6px 18px rgba(47, 79, 58, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 5px;
    color: ${color('textPrimary')};
    border: 1px solid rgba(255, 255, 255, 0.35);

    strong {
        font-size: clamp(0.72rem, 1.25vw, 0.84rem);
        font-weight: 700;
        line-height: 1.25;
    }

    ${mediaBreakpointDown('md')} {
        width: calc(50% - 12px);
        max-width: 168px;
    }
`;

export const AvatarStub = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: ${color('avatarStub')};
    border: 2px solid rgba(255, 255, 255, 0.75);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        inset: 10px 12px;
        border-radius: 50% 50% 40% 40%;
        background: rgba(255, 255, 255, 0.22);
    }
`;

export const MetaLine = styled.span`
    font-size: 0.65rem;
    font-weight: 500;
    opacity: 0.78;
    line-height: 1.2;
`;

export const LifespanLine = styled.span`
    font-size: 0.62rem;
    opacity: 0.72;
    line-height: 1.25;
`;
