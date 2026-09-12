import styled, { css } from 'styled-components';
import Link from 'next/link';
import { color, font, hover, mediaBreakpointDown, mediaBreakpointUp, vw } from '@/style/mixins';

export const Bar = styled.header`
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;     
    min-height: ${vw(55, 'xs')};
    padding: 0 ${vw(16, 'xs')};
    background-color: ${color('forest')};
    color: ${color('white')};
    box-shadow: 0 1px 0 ${color('black', 0.08)};

    ${mediaBreakpointUp('lg')} {
        min-height: ${vw(60)};
        padding: 0 ${vw(20)};
    }
`;

export const BarInner = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${vw(8, 'xs')};
`;

export const LeftCol = styled.div`
    display: flex;
    flex: 1 1 0;
    align-items: center;
    justify-content: flex-start;
    min-width: 0;

    ${mediaBreakpointDown('xl')} {
        display: none;
    }
`;

export const Nav = styled.nav`
    display: none;
    align-items: center;
    gap: ${vw(28)};

    ${mediaBreakpointUp('lg')} {
        display: flex;
    }
`;

export const StyledLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`;

export const Username = styled.div`
    color: ${color('white')};
    opacity: 0.95;
`;

export const NavLink = styled.span<{ $active?: boolean }>`
    ${font('navigation')};
    color: ${color('white')};
    opacity: ${({ $active }) => ($active ? 1 : 0.88)};
    padding: 4px 0;
    border-bottom: 2px solid transparent;
    transition: opacity 0.2s ease, border-color 0.2s ease;
    white-space: nowrap;

    ${({ $active }) =>
        $active &&
        css`
            border-bottom-color: ${color('white')};
        `}

    ${hover(css`
        opacity: 1;
    `)}
`;

export const LogoCol = styled.div`
    flex: 0 0 auto;
    text-align: center;

    a {
        color: inherit;
    }
`;

export const RightCol = styled.div`
    display: flex;
    flex: 1 1 0;
    align-items: center;
    justify-content: flex-end;
    gap: ${vw(10, 'xs')};
    min-width: 0;

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(16)};
    }
`;

export const AuthCluster = styled.div`
    display: none;
    align-items: center;
    gap: ${vw(12)};

    ${mediaBreakpointUp('lg')} {
        display: flex;
    }
`;

export const BtnOutline = styled.button`
    ${font('navigation')};
    padding: ${vw(8)} ${vw(16)};
    border-radius: 5px;
    border: 1px solid ${color('white')};
    background: transparent;
    color: ${color('white')};
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    ${hover(css`
        background: ${color('white', 0.12)};
    `)}
`;

export const BtnSolid = styled.button`
    ${font('navigationStrong')};
    padding: ${vw(8)} ${vw(18)};
    border-radius: 5px;
    border: none;
    background: ${color('white')};
    color: ${color('forestDeep')};
    transition: opacity 0.2s ease;

    ${hover(css`
        opacity: 0.92;
    `)}
`;

export const Burger = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: ${vw(20, 'xs')};
    height: ${vw(7, 'xs')};
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;

    span {
        display: block;
        height: 2px;
        border-radius: 2px;
        background: ${color('white')};
    }

    ${mediaBreakpointUp('lg')} {
        display: none;
    }
`;
