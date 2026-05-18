import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.button`
    color: ${color('white')};
    transition: background-color 0.3s ease-in-out;
    background-color: ${color('brown')};
    text-align: center;

    ${font('font2')};
    height: fit-content;
    padding: ${vw(12, 'xs')} ${vw(25, 'xs')};
    border-radius: 3px;

    &:hover {
        cursor: pointer;
        background-color: ${color('brown', 0.9)};
    }

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(10)} ${vw(25)};
        height: ${vw(104, 'mac')};
        width: 100%;
    }
`;
