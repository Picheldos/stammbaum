import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Backdrop = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    background: ${color('black', 0.18)};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.3s ease-in-out;
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

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(22)} ${vw(30)} ${vw(14)};
        gap: ${vw(14)};
    }
`;

export const CloseBtn = styled.button`
    background: transparent;
    border: none;
    color: ${color('textPrimary')};
    ${font('bodyLarge')};
    cursor: pointer;
    flex-shrink: 0;
    padding: 4px ${vw(8, 'xs')};
    transition: color 0.3s ease-in-out;

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
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23333333' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right ${vw(10, 'xs')} center;

    ${mediaBreakpointUp('xl')} {
        border-radius: ${vw(8)};
        padding: ${vw(12)} ${vw(36)} ${vw(12)} ${vw(16)};
        background-position: right ${vw(14)} center;
        font-size: 16px;
    }

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

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(8)} ${vw(30)} ${vw(22)};
        gap: ${vw(16)};
    }
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
    transition: color 0.3s ease-in-out;
    &:hover { color: ${color('forest')}; }

    ${mediaBreakpointUp('xl')} {
        padding: ${vw(9)} 0;
        font-size: 16px;
        line-height: 1.2;
    }
`;

/**
 * Same visual weight as MenuItem — on desktop the previous `mobileBody` role
 * ballooned these longer labels to 22px, so keep them aligned with the rest of
 * the menu instead.
 */
export const CondensedMenuItem = styled(MenuItem)``;

/* --------------------- Hidden relatives --------------------- */

export const HiddenSection = styled.div`
    margin: 0 ${vw(22, 'xs')} ${vw(22, 'xs')};
    padding-top: ${vw(14, 'xs')};
    border-top: 1px solid ${color('ink', 0.15)};
    display: flex;
    flex-direction: column;
    gap: ${vw(10, 'xs')};

    ${mediaBreakpointUp('xl')} {
        margin: 0 ${vw(30)} ${vw(30)};
        padding-top: ${vw(18)};
        gap: ${vw(12)};
    }
`;

export const HiddenTitle = styled.h3`
    margin: 0;
    color: ${color('textPrimary')};
    ${font('mobileControl')};
    opacity: 0.75;
`;

export const HiddenList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${vw(8, 'xs')};

    ${mediaBreakpointUp('xl')} {
        gap: ${vw(8)};
    }
`;

export const HiddenRow = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${vw(10, 'xs')};
    background: ${color('cream', 0.55)};
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(8, 'xs')} ${vw(10, 'xs')};

    ${mediaBreakpointUp('xl')} {
        border-radius: ${vw(8)};
        padding: ${vw(8)} ${vw(12)};
        gap: ${vw(12)};
    }
`;

export const HiddenName = styled.span`
    ${font('mobileAction')};
    color: ${color('textPrimary')};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const RestoreButton = styled.button`
    flex-shrink: 0;
    border: 1px solid ${color('forest')};
    background: transparent;
    color: ${color('forest')};
    border-radius: ${vw(6, 'xs')};
    padding: ${vw(5, 'xs')} ${vw(12, 'xs')};
    ${font('mobileControl')};
    cursor: pointer;
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

    &:hover {
        background: ${color('forest')};
        color: ${color('cream')};
    }
    &:focus-visible {
        outline: 2px solid ${color('forest')};
        outline-offset: 2px;
    }

    ${mediaBreakpointUp('xl')} {
        border-radius: ${vw(6)};
        padding: ${vw(5)} ${vw(12)};
    }
`;
