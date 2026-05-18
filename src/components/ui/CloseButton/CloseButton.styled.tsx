import styled from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div<{ $tone?: 'dark' | 'light' }>`
    display: flex;
    transform: translateY(-3px);
    width: fit-content;
    height: fit-content;

    span {
        width: 2px;
        height: ${vw(26, 'xs')};
        background: ${({ $tone }) => ($tone === 'light' ? color('forest') : color('darkBrown'))};
        border-radius: 5px;
        transform: rotate(45deg);

        ${mediaBreakpointUp('xl')} {
            width: 3px;
            height: ${vw(48, 'mac')};
        }

        &:first-child {
            transform: rotate(-45deg) translate(2px, 2px);
        }
    }

    &:hover {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        transform: translateY(-4px);
    }
`;
