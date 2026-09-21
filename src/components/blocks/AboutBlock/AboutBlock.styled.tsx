import { color, font, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';
import { xlFontSize } from '@/style/typography';
import styled, { css } from 'styled-components';

const plusButtonHoverStyles = css`
    background: ${color('white', 0.1)};
`;

export const PlusButton = styled.button`
    margin-top: auto;
    margin-left: auto;
    padding: 0;
    border-radius: 50%;

    width: ${vw(40, 'xs')};
    height: ${vw(40, 'xs')};
    background: transparent;
    color: ${color('white')};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
        ${plusButtonHoverStyles}
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(61)};
        height: ${vw(61)};
    }

    svg {
        width: ${vw(40, 'xs')};
        height: ${vw(40, 'xs')};

        ${mediaBreakpointUp('lg')} {
            width: ${vw(61)};
            height: ${vw(61)};
        }
    }
`;

export const Container = styled.div<{ variant?: string; color?: string; $textColor?: string }>`
    border-radius: 5px;
    opacity: 1;
    transform: rotate(${vw(0, 'xs')}deg);
    display: flex;
    flex-direction: row;

    margin-bottom: ${vw(10, 'xs')};

    padding: ${vw(17.067, 'xs')};
    height: ${vw(119.467, 'xs')};

    border: 1px solid ${color('ink', 0.5)};

    ${mediaBreakpointUp('lg')} {
        width: ${vw(463)};
        height: ${vw(426)};
        padding: ${vw(30)};
        margin-bottom: ${vw(12)};
    }

    ${({ variant }) =>
        variant === 'image' &&
        `
        border: none;
      padding: 0!important;
      overflow: hidden!important;
    `}

    ${({ variant }) =>
        variant === 'step' &&
        css`
            cursor: pointer;

            &:hover ${PlusButton} {
                ${plusButtonHoverStyles}
            }
        `}

  ${({ variant }) =>
        variant === 'text' &&
        css`
            width: auto;
            height: auto;
            border: 1px solid ${color('ink', 0.5)};

            ${mediaBreakpointUp('fhd')} {
                width: ${vw(463)};
                height: ${vw(426)};
            }
        `}

  ${({ variant }) =>
        variant === 'empty' &&
        css`
            border: none;
            ${mediaBreakpointDown('lg')} {
                display: none;
            }
        `}

  ${({ color, $textColor }) =>
        color &&
        `
          color: ${$textColor ?? 'white'};
          background: ${!$textColor ? color : 'white'};

          svg path, svg rect {
            stroke: ${$textColor ? '#30302A' : 'white'};
          }
          
    `}
`;

export const Title = styled.div<{ $variant?: string }>`
    ${font('mobileBody')};
    ${xlFontSize(18)};

    ${({ $variant }) =>
        $variant !== 'text' &&
        css`
            max-width: ${vw(150, 'xs')};

            ${mediaBreakpointUp('lg')} {
                ${font('cardTitle')};
                ${xlFontSize(22)};
                max-width: ${vw(240)};
            }
        `}
`;

export const StepNumber = styled.h2`
    ${font('landingStepHeading')};
    margin-bottom: ${vw(8.533, 'xs')};

    ${mediaBreakpointUp('lg')} {
        margin-bottom: ${vw(30)};
    }
`;

export const Subtitle = styled.p`
    ${font('mobileBody')};
    opacity: 0.9;
`;

export const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    img {
        object-fit: cover;
        object-position: center;
    }
`;

export const TextContainer = styled.div``;
