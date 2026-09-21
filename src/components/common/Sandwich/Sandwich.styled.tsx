import styled from 'styled-components';
import Link from 'next/link';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div<{ open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;

    width: ${vw(193.707, 'xs')};
    padding: ${vw(13.653, 'xs')} ${vw(18.773, 'xs')} ${vw(23.893, 'xs')};
    background: ${color('cream')};
    border-left: 1px solid ${color('darkGray')};
    box-shadow: ${vw(-8, 'xs')} 0 ${vw(28, 'xs')} ${color('forestDeep', 0.14)};

    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    ${({ open }) =>
        open &&
        `
        transform: translateX(0);
    `}

    /* Desktop: the mobile 'xs' vw units blow the panel up to ~60vw; pin it to a
       sensible right-hand drawer instead. */
    ${mediaBreakpointUp('md')} {
        width: min(${vw(320)}, 340px);
        padding: ${vw(20)} ${vw(28)} ${vw(32)};
        box-shadow: ${vw(-8)} 0 ${vw(28)} ${color('forestDeep', 0.14)};
    }

    ${mediaBreakpointUp('fhd')} {
        width: 340px;
        padding: 20px 28px 32px;
    }
`;

export const SandwichTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    flex-shrink: 0;
    height: ${vw(20, 'xs')};

    ${mediaBreakpointUp('md')} {
        height: ${vw(28)};
    }
`;

export const SandwichMenu = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    min-height: 0;
`;

export const MenuLink = styled(Link)`
    color: inherit;
    text-decoration: none;
`;

export const SandwichMenuLink = styled.span`
    ${font('mobileAction')};
    color: ${color('textPrimary')};
    display: block;
    padding: ${vw(10, 'xs')} 0;
    transition: color 0.2s ease-in-out;

    @media (hover: hover) {
        &:hover {
            cursor: pointer;
            color: ${color('forest')};
        }
    }

    ${mediaBreakpointUp('md')} {
        padding: ${vw(12)} 0;
    }
`;

export const SandwichMenuHint = styled.span`
    ${font('bodySmall')};
    color: ${color('textPrimary')};
    opacity: 0.55;
    padding: ${vw(6, 'xs')} 0 2px;

    &:first-of-type {
        margin-top: ${vw(12, 'xs')};
        padding-top: ${vw(16, 'xs')};
        border-top: 1px solid ${color('gray')};
    }
`;
