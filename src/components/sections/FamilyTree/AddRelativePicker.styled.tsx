import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${vw(8, 'xs')};
`;

export const Choice = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(12, 'xs')};
    cursor: pointer;
    ${font('mobileAction')};

    &:hover {
        background: ${color('slateBlue')};
    }
`;
