import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Container = styled.footer`
    ${font('font7')};
    margin-top: auto;
    padding: ${vw(20, 'xs')} ${vw(20, 'xs')} ${vw(28, 'xs')};
    text-align: center;
    color: ${color('textPrimary')};
    opacity: 0.72;
`;
