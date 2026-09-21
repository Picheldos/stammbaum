import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, vw } from '@/style/mixins';
import { xlFontSize, xlOnly } from '@/style/typography';

export const Container = styled.div<{ $light?: boolean; $compact?: boolean }>`
    cursor: pointer;
    ${({ $compact }) => font($compact ? 'labelStrong' : 'logo')};
    ${({ $compact }) => $compact && xlFontSize(14)};
    ${({ $compact }) => $compact && xlOnly('font-weight', '500')};
    padding: 4px ${vw(6, 'xs')};
    transition: opacity 0.3s ease-in-out;

    ${({ $compact }) =>
        $compact &&
        css`
            ${mediaBreakpointDown('md')} {
                ${font('mobileControl')};
            }
        `}

    ${({ $light }) =>
        $light &&
        css`
            color: ${color('white')};
        `}

    ${hover(css`
        cursor: pointer;
        opacity: 0.88;
    `)}
`;
