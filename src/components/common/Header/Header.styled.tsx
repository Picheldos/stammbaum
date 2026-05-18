import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointUp } from '@/style/mixins';

export const Bar = styled.header`
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    padding: 0 16px;
    background-color: ${color('forest')};
    color: ${color('white')};
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);

    ${mediaBreakpointUp('lg')} {
        min-height: 72px;
        padding: 0 32px;
    }
`;

export const BarInner = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    max-width: 1440px;
    gap: 8px;
`;

export const LeftCol = styled.div`
    display: flex;
    align-items: center;
    justify-self: start;
    min-width: 0;
`;

export const Nav = styled.nav`
    display: none;
    align-items: center;
    gap: 28px;

    ${mediaBreakpointUp('lg')} {
        display: flex;
    }
`;

export const NavLink = styled.span<{ $active?: boolean }>`
    ${font('headerNav')};
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
    justify-self: center;
    text-align: center;

    a {
        color: inherit;
    }
`;

export const RightCol = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    min-width: 0;

    ${mediaBreakpointUp('lg')} {
        gap: 16px;
    }
`;

export const AuthCluster = styled.div`
    display: none;
    align-items: center;
    gap: 12px;

    ${mediaBreakpointUp('lg')} {
        display: flex;
    }
`;

export const BtnOutline = styled.button`
    ${font('headerNav')};
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid ${color('white')};
    background: transparent;
    color: ${color('white')};
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    ${hover(css`
        background: rgba(255, 255, 255, 0.12);
    `)}
`;

export const BtnSolid = styled.button`
    ${font('headerNav')};
    padding: 8px 18px;
    border-radius: 6px;
    border: none;
    background: ${color('white')};
    color: ${color('forestDeep')};
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s ease;

    ${hover(css`
        opacity: 0.92;
    `)}
`;

export const Burger = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 22px;
    height: 16px;
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
