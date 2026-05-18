import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Container = styled.div<{ open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;

    width: min(420px, 100vw);
    padding: ${vw(16, 'xs')} ${vw(22, 'xs')} ${vw(28, 'xs')};
    background: ${color('creamWarm')};
    border-left: 1px solid ${color('darkGray')};
    box-shadow: -8px 0 28px rgba(47, 79, 58, 0.14);

    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    ${({ open }) =>
        open &&
        `
        transform: translateX(0);
    `}
`;

export const SandwichTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    flex-shrink: 0;
`;

export const SandwichMenu = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    gap: ${vw(4, 'xs')};
    min-height: 0;
`;

export const SandwichMenuLink = styled.span`
    ${font('title3')};
    color: ${color('textPrimary')};
    display: block;
    padding: 10px 0;
    transition: color 0.2s ease-in-out;

    @media (hover: hover) {
        &:hover {
            cursor: pointer;
            color: ${color('forest')};
        }
    }
`;

export const SandwichMenuHint = styled.span`
    ${font('font7')};
    color: ${color('textPrimary')};
    opacity: 0.55;
    padding: 6px 0 2px;

    &:first-of-type {
        margin-top: 12px;
        padding-top: 16px;
        border-top: 1px solid ${color('gray')};
    }
`;
