import styled from 'styled-components';
import { color, font, vw, mediaBreakpointUp } from '@/style/mixins';

export const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${vw(8, 'xs')};

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(8)};
    }
`;

export const Choice = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(12, 'xs')};
    cursor: pointer;
    ${font('mobileAction')};
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background: ${color('slateBlue')};
    }

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(12)} ${vw(16)};
        border-radius: ${vw(8)};
    }
`;
