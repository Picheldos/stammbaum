import styled from 'styled-components';
import { vw } from '@/style/mixins';

export const SvgRoot = styled.svg`
    display: block;
    width: min(92%, ${vw(420, 'xs')});
    height: auto;
    margin: 0 auto;
    opacity: 0.92;
`;
