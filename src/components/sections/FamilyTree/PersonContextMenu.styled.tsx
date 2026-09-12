import styled, { css } from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const MenuRoot = styled.div<{ $x: number; $y: number }>`
    position: fixed;
    top: ${({ $y }) => $y}px;
    left: ${({ $x }) => $x}px;
    width: ${vw(240, 'xs')};
    background: ${color('cream')};
    border-radius: ${vw(8, 'xs')};
    box-shadow: 0 ${vw(12, 'xs')} ${vw(28, 'xs')} ${color('forestDeep', 0.22)};
    border: 1px solid ${color('treeGreen', 0.18)};
    overflow: hidden;
    z-index: 800;
`;

export const MenuHeader = styled.div`
    background: ${color('forest')};
    color: ${color('white')};
    padding: ${vw(10, 'xs')} ${vw(14, 'xs')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${font('mobileHeader')};
`;

export const MenuClose = styled.button`
    background: transparent;
    border: none;
    color: ${color('white')};
    cursor: pointer;
    ${font('bodyLarge')};
`;

export const MenuList = styled.ul`
    list-style: none;
    margin: 0;
    padding: ${vw(8, 'xs')} 0;
    background: ${color('landingCard')};
`;

export const MenuItem = styled.button<{ $condensed?: boolean }>`
    display: block;
    width: 100%;
    border: 0;
    text-align: left;
    padding: ${vw(9, 'xs')} ${vw(16, 'xs')};
    cursor: pointer;
    color: ${color('textPrimary')};
    ${font('mobileAction')};

    ${({ $condensed }) =>
        $condensed &&
        css`
            ${font('mobileBody')};
        `}

    &:hover {
        background: ${color('treeGreen', 0.1)};
    }
`;
