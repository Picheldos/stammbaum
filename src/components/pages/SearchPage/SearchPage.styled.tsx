import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Body = styled.section`
    ${font('body')};
    padding: ${vw(32, 'xs')} 0;
    max-width: ${vw(760, 'xs')};
    margin: 0 auto;
`;

export const SearchForm = styled.form`
    display: flex;
    gap: ${vw(10, 'xs')};
    margin: ${vw(24, 'xs')} 0;
`;

export const VisuallyHiddenLabel = styled.label`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
`;

export const SearchInput = styled.input`
    min-width: 0;
    flex: 1;
    padding: ${vw(12, 'xs')} ${vw(14, 'xs')};
    border: 1px solid ${color('greenAccent')};
    border-radius: 5px;
    ${font('body')};
`;

export const SearchButton = styled.button`
    padding: ${vw(12, 'xs')} ${vw(18, 'xs')};
    border-radius: 5px;
    background: ${color('blueAction')};
    color: ${color('white')};
    cursor: pointer;
`;
