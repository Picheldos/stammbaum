import { color, font, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';
import styled from 'styled-components';

export const LandingRoot = styled.section`
    width: 100%;
    padding-top: ${vw(51.2, 'xs')};

    ${mediaBreakpointUp('lg')} {
        padding-top: ${vw(40)};
        height: calc(100vh - ${vw(60)} - ${vw(40)});
    }
`;

export const HeroGrid = styled.div`
    display: grid;
    align-items: start;

    ${mediaBreakpointUp('lg')} {
        grid-template-columns: minmax(0, 1fr) minmax(${vw(280)}, 1.08fr);
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
    ${font('heroTitle')};
    line-height: 1.1;
    color: ${color('ink')};
    max-width: ${vw(213.333, 'xs')};

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
        max-width: ${vw(256, 'xs')};
        margin-top: ${vw(34.133, 'xs')};
    }
`;

export const StepItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    color: ${color('textPrimary')};

    ${mediaBreakpointDown('md')} {
        color: ${color('darkGray')};
    }

    text-align: left;

    ${font('step')};

    &:not(:last-of-type) {
        margin-bottom: ${vw(17.067, 'xs')};
    }

    ${mediaBreakpointUp('xl')} {
        text-align: auto;
        &:not(:last-of-type) {
            margin-bottom: ${vw(40)};
        }
    }
`;

export const StepIndex = styled.span<{ $weight: 500 | 700 | 800 }>`
    flex-shrink: 0;
    ${font('stepIndex')};
    font-weight: ${({ $weight }) => $weight};
    color: ${color('cemeteryBorderAlt')};
    opacity: 0.4;

    ${mediaBreakpointUp('xl')} {
        ${font('display')};
    }
`;

export const StepCopy = styled.span`
    flex: 1;
    padding-bottom: 5px;
    padding-left: 5px;
    ${font('mobileBody')};
`;

export const CtaButton = styled.button`
    align-self: flex-start;
    width: 100%;
    max-width: ${vw(296, 'xs')};
    padding: ${vw(14.4, 'xs')} ${vw(24, 'xs')};
    border-radius: 5px;
    ${font('mobileAction')};
    color: ${color('white')};
    background: ${color('landingCta')};
    cursor: pointer;
    box-shadow: 0 4px ${vw(14, 'xs')} ${color('slateShadow', 0.28)};
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

    &:hover {
        background: ${color('slateBlue')};
        box-shadow: 0 ${vw(6, 'xs')} ${vw(20, 'xs')} ${color('slateShadow', 0.34)};
    }

    &:active {
        transform: translateY(1px);
    }

    &:focus-visible {
        outline: 3px solid ${color('forest')};
        outline-offset: 3px;
    }

    ${mediaBreakpointUp('lg')} {
        box-shadow: 0 4px ${vw(14)} ${color('slateShadow', 0.28)};

        &:hover {
            box-shadow: 0 ${vw(6)} ${vw(20)} ${color('slateShadow', 0.34)};
        }
    }

    ${mediaBreakpointDown('md')} {
        align-self: stretch;
        max-width: none;
        margin-top: ${vw(25.6, 'xs')};
    }

    @media (min-width: 1440px) {
        max-width: ${vw(460)};
        min-height: ${vw(75)};
        padding: ${vw(16)} ${vw(32)};
    }
`;

export const TreeScene = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;

    ${mediaBreakpointDown('lg')} {
        margin-top: ${vw(17.067, 'xs')};
    }
`;

export const TreeLayer = styled.div`
    position: relative;
    flex: 1;

    img {
        object-fit: cover;
        pointer-events: none;
    }
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    z-index: 0;

    width: 100%;
    height: ${vw(187.733, 'xs')};

    ${mediaBreakpointDown('lg')} {
        flex: unset;
        order: 2;
        padding-bottom: 0;
    }

    ${mediaBreakpointUp('lg')} {
        justify-content: flex-end;
        pointer-events: none;
        position: absolute;

        width: ${vw(900)};
        height: ${vw(750)};
        inset: auto 0 calc(0px - 60px - ${vw(40)});
    }


    /* ${mediaBreakpointUp('xxl')} {
        inset: auto 0 calc(0 - 60px - ${vw(40)});;
    } */
`;

export const CardsOverlay = styled.div`
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: ${vw(145)};
    pointer-events: none;
    gap: clamp(${vw(14, 'xs')}, 2.8vh, ${vw(28, 'xs')});
    z-index: 1;

    ${mediaBreakpointDown('lg')} {
        position: static;
        inset: unset;
        order: 3;
        padding: ${vw(20, 'xs')} 0 0;
        gap: ${vw(16, 'xs')};
        pointer-events: auto;
        align-items: center;
        flex-grow: 0;
        margin-bottom: ${vw(8, 'xs')};
    }
`;

export const CardTier = styled.div<{ $compact?: boolean }>`
    display: flex;
    justify-content: center;
    gap: ${({ $compact }) =>
        $compact
            ? `clamp(${vw(8, 'xs')}, 2vw, ${vw(16, 'xs')})`
            : `clamp(${vw(10, 'xs')}, 2vw, ${vw(32, 'xs')})`};

    ${mediaBreakpointUp('lg')} {
        gap: ${({ $compact }) =>
            $compact ? `clamp(${vw(8)}, 2vw, ${vw(16)})` : `clamp(${vw(10)}, 2vw, ${vw(32)})`};
    }
    flex-wrap: wrap;
    width: 100%;
`;
