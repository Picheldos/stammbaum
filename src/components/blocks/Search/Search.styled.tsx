import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    min-width: 0;
    margin: 0 ${vw(12, 'xs')};

    ${mediaBreakpointUp('xl')} {
        margin: 0 ${vw(40, 'mac')};
    }
`;

export const SearchTrigger = styled.button<{ $isOpen: boolean }>`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    margin-right: ${vw(8, 'xs')};

    ${({ $isOpen }) =>
        $isOpen
            ? `
      animation: fadeInOutFast 2s ease-out;
      @keyframes fadeInOutFast {
        0% { opacity: 1; }
        1% { opacity: 0; }
        100% { opacity: 1; }
      }
      position: absolute;
      left: 10px;
    `
            : `position: none`};

    svg {
        width: ${vw(20, 'xs')};
        height: ${vw(23, 'xs')};
    }

    ${mediaBreakpointUp('xl')} {
        margin-right: ${vw(12, 'mac')};

        svg {
            width: ${vw(40, 'mac')};
            height: ${vw(40, 'mac')};
        }
    }
`;

export const SearchFieldWrap = styled.div<{ $isOpen: boolean }>`
    flex: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    min-width: 0;
    max-width: ${({ $isOpen }) => ($isOpen ? '100%' : 0)};
    overflow: hidden;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: max-width 0.5s ease-out, opacity 0.25s ease-out;
    display: flex;
    align-items: center;
`;

export const SearchInputInner = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    border: 1px solid ${color('black')};
    border-radius: 2px;
    background: transparent;
    padding-left: ${vw(30, 'xs')};
    padding-right: ${vw(10, 'xs')};
    height: ${vw(40, 'xs')};

    ${mediaBreakpointUp('xl')} {
        height: ${vw(56, 'mac')};
        padding-left: ${vw(56, 'mac')};
        padding-right: ${vw(16, 'mac')};
    }
`;

export const SearchInput = styled.input`
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    ${font('font2')};
    font-size: ${vw(14, 'xs')};

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
        -webkit-appearance: none;
        appearance: none;
    }

    &::-moz-search-cancel-button {
        display: none;
    }

    &::placeholder {
        color: ${color('darkGray')};
    }

    ${mediaBreakpointUp('xl')} {
        font-size: ${vw(18, 'mac')};
    }
`;
