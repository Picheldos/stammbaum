import { color } from '@/style/mixins';
import styled from 'styled-components';

export const Container = styled.div<{ visible?: boolean }>`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${color('lightGray')};
    visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
    opacity: ${({ visible }) => (visible ? '1' : '0')};
    transition: opacity 0.8s ease-in-out, visibility 0.8s ease-in-out;
    z-index: 200;
`;
