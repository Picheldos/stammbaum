import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Backdrop = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    background: ${color('black', 0.18)};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.25s ease;
    z-index: 700;
`;

export const Panel = styled.aside<{ $open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: min(${vw(360, 'xs')}, 86vw);
    background: ${color('landingCard')};
    box-shadow: ${vw(-8, 'xs')} 0 ${vw(28, 'xs')} ${color('forestDeep', 0.18)};
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    z-index: 710;

    ${mediaBreakpointUp('xl')} {
        width: min(${vw(578)}, 30.1vw);
    }
`;

export const TopBar = styled.div`
    padding: ${vw(18, 'xs')} ${vw(22, 'xs')} ${vw(12, 'xs')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${vw(12, 'xs')};
    color: ${color('textPrimary')};
    ${font('bodyLarge')};
`;

export const CloseBtn = styled.button`
    background: transparent;
    border: none;
    color: ${color('textPrimary')};
    ${font('bodyLarge')};
    cursor: pointer;
    flex-shrink: 0;
    padding: 4px ${vw(8, 'xs')};
    transition: color 0.2s ease;

    &:hover { color: ${color('forest')}; }
    &:focus-visible {
        outline: 2px solid ${color('forest')};
        outline-offset: 2px;
        border-radius: 4px;
    }
`;

export const TreeSelect = styled.select`
    width: 100%;
    background-color: ${color('cream')};
    border: 2px solid ${color('forest')};
    border-radius: ${vw(8, 'xs')};
    ${font('mobileAction')};
    color: ${color('textPrimary')};
    padding: ${vw(10, 'xs')} ${vw(32, 'xs')} ${vw(10, 'xs')} ${vw(14, 'xs')};
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333333' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right ${vw(10, 'xs')} center;

    &:hover { background-color: ${color('lightGray')}; border-color: ${color('forestDeep')}; }
    &:focus, &:focus-visible {
        outline: none;
        border-color: ${color('forestDeep')};
        box-shadow: 0 0 0 3px ${color('forest', 0.15)};
    }
    &:active { transform: scale(0.98); }
    option { background: ${color('white')}; color: ${color('textPrimary')}; padding: ${vw(8, 'xs')}; border: none; }
    option:hover, option:checked { background: ${color('forest')}; color: ${color('white')}; }
`;

export const Menu = styled.ul`
    list-style: none;
    margin: 0;
    padding: ${vw(8, 'xs')} ${vw(22, 'xs')} ${vw(22, 'xs')};
    display: flex;
    flex-direction: column;
    gap: ${vw(14, 'xs')};
`;

export const MenuItem = styled.button`
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    padding: ${vw(9, 'xs')} 0;
    color: ${color('textPrimary')};
    ${font('mobileAction')};
    cursor: pointer;
    &:hover { color: ${color('forest')}; }
`;

export const CondensedMenuItem = styled(MenuItem)`
    ${font('mobileBody')};
`;
