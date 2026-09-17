import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointDown, vw } from '@/style/mixins';

export const Container = styled.div<{ $light?: boolean; $compact?: boolean }>`
    cursor: pointer;
    ${({ $compact }) => font($compact ? 'labelStrong' : 'logo')};
    padding: 4px ${vw(6, 'xs')};

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
