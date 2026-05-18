import styled from 'styled-components';
import { color, font, mediaBreakpointDown, vw } from '@/style/mixins';

export const Container = styled.div<{ $tone: 'dark' | 'light' }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${({ $tone }) => ($tone === 'light' ? color('white') : color('black'))};

    &:hover {
        cursor: pointer;
    }

    svg {
        margin-right: 3px;
        fill: ${({ $tone }) => ($tone === 'light' ? color('white') : 'inherit')};

        ${mediaBreakpointDown('xl')} {
            height: ${vw(28, 'xs')};
            width: ${vw(26, 'xs')};
        }
    }
`;

export const LogoText = styled.div`
    ${font('logo')};
    align-items: center;
    user-select: none;

    ${mediaBreakpointDown('xl')} {
        display: none;
    }
`;

export const Wordmark = styled.span`
    ${font('logoSerif')};
    user-select: none;
    white-space: nowrap;
`;
