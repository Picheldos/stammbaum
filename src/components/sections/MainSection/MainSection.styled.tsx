import { color, font, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';
import { xlFontSize, xlOnly } from '@/style/typography';
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
    ${xlFontSize(22)};

    &:not(:last-of-type) {
        margin-bottom: ${vw(17.067, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        text-align: auto;
        &:not(:last-of-type) {
            margin-bottom: ${vw(30)};
        }
    }
`;

export const StepIndex = styled.span<{ $weight: 500 | 700 | 800 }>`
    flex-shrink: 0;
    ${font('stepIndex')};
    font-weight: ${({ $weight }) => $weight};
    color: ${color('cemeteryBorderAlt')};
    opacity: 0.4;

`;

export const StepCopy = styled.span`
    flex: 1;
    padding-bottom: 5px;
    padding-left: 5px;
    ${font('mobileBody')};
    ${xlFontSize(22)};
`;

export const CtaButton = styled.button`
    align-self: flex-start;
    width: 100%;
    max-width: ${vw(296, 'xs')};
    padding: ${vw(14.4, 'xs')} ${vw(24, 'xs')};
    border-radius: 5px;
    ${font('mobileAction')};
    ${xlFontSize(22)};
    ${xlOnly('line-height', '1.366')};
    color: ${color('white')};
    background: ${color('landingCta')};
    cursor: pointer;
    box-shadow: 0 4px ${vw(14, 'xs')} ${color('slateShadow', 0.28)};
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background 0.3s ease-in-out;

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
        max-width: ${vw(460)};
        min-height: ${vw(75)};
        padding: ${vw(16)} ${vw(32)};

        &:hover {
            box-shadow: 0 ${vw(6)} ${vw(20)} ${color('slateShadow', 0.34)};
        }
    }

    ${mediaBreakpointDown('md')} {
        align-self: stretch;
        max-width: none;
        margin-top: ${vw(25.6, 'xs')};
        order: 3;
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
    height: ${vw(300, 'xs')};



    ${mediaBreakpointDown('lg')} {
        flex: unset;
        order: 2;
        padding-bottom: 0;
        margin-top: ${vw(60, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        pointer-events: none;

        width: ${vw(900)};
        height: ${vw(850)};
    }


    /* ${mediaBreakpointUp('xxl')} {
        inset: auto 0 calc(0 - 60px - ${vw(40)});;
    } */
`;

