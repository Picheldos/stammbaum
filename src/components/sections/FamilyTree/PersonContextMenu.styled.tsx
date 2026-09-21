import styled, { css } from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const MenuRoot = styled.div<{ $x: number; $y: number }>`
    position: fixed;
    top: ${({ $y }) => $y}px;
    left: ${({ $x }) => $x}px;
    width: ${vw(240, 'xs')};
    background: ${color('popupBackground')};
    border-radius: ${vw(8, 'xs')};
    box-shadow: 0 ${vw(12, 'xs')} ${vw(28, 'xs')} ${color('forestDeep', 0.22)};
    border: 1px solid ${color('mutedText', 0.3)};
    overflow: hidden;
    z-index: 800;

    ${mediaBreakpointUp('lg')} {
        width: ${vw(240)};
        border-radius: ${vw(8)};
        box-shadow: 0 ${vw(12)} ${vw(28)} ${color('forestDeep', 0.22)};
    }
`;

export const MenuHeader = styled.div`
    background: ${color('forest')};
    color: ${color('cream')};
    padding: ${vw(10, 'xs')} ${vw(14, 'xs')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${font('mobileHeader')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(14)};
    }
`;

export const MenuClose = styled.button`
    background: transparent;
    border: none;
    color: ${color('cream')};
    cursor: pointer;
    ${font('bodyLarge')};
`;

export const MenuList = styled.ul`
    list-style: none;
    margin: 0;
    padding: ${vw(8, 'xs')} 0;
    background: ${color('popupBackground')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(8)} 0;
    }
`;

export const MenuItem = styled.button<{ $condensed?: boolean }>`
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    padding: ${vw(9, 'xs')} ${vw(16, 'xs')};
    cursor: pointer;
    color: ${color('ink')};
    ${font('mobileAction')};
    transition: background-color 0.3s ease-in-out;

    ${({ $condensed }) =>
        $condensed &&
        css`
            ${font('mobileBody')};
        `}

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(9)} ${vw(16)};
    }

    &:hover {
        background: ${color('ink', 0.08)};
    }
`;
