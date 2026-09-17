import styled from 'styled-components';
import Link from 'next/link';
import { color, font, mediaBreakpointDown, vw } from '@/style/mixins';

export const LogoLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`;

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
            height: ${vw(23.893, 'xs')};
            width: ${vw(22.187, 'xs')};
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
    line-height: 1.333;
    letter-spacing: 0;
    user-select: none;
    white-space: nowrap;
`;
