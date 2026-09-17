import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    min-width: 0;
    margin: 0 ${vw(10.24, 'xs')};

    ${mediaBreakpointUp('xl')} {
        margin: 0 ${vw(40)};
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
    margin-right: ${vw(6.827, 'xs')};

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
      left: ${vw(10, 'xs')};
    `
            : `position: static`};

    svg {
        width: ${vw(17.067, 'xs')};
        height: ${vw(19.627, 'xs')};
    }

    ${mediaBreakpointUp('xl')} {
        margin-right: ${vw(12)};

        svg {
            width: ${vw(40)};
            height: ${vw(40)};
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

export const SearchForm = styled.form`
    display: flex;
    width: 100%;
    min-width: 0;
`;

export const SearchInputInner = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    border: 1px solid ${color('black')};
    border-radius: 2px;
    background: transparent;
    padding-left: ${vw(25.6, 'xs')};
    padding-right: ${vw(8.533, 'xs')};
    height: ${vw(34.133, 'xs')};

    ${mediaBreakpointUp('xl')} {
        height: ${vw(56)};
        padding-left: ${vw(56)};
        padding-right: ${vw(16)};
    }
`;

export const SearchInput = styled.input`
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    ${font('body')};

    &::-webkit-search-cancel-button,
    &::-webkit-search-decoration {
        appearance: none;
    }

    &::-moz-search-cancel-button {
        display: none;
    }

    &::placeholder {
        color: ${color('darkGray')};
    }

    &:focus-visible {
        outline: 2px solid ${color('forest')};
        outline-offset: 2px;
    }

`;
