import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Container = styled.footer`
    ${font('bodySmall')};
    margin-top: auto;
    padding: ${vw(17.067, 'xs')} ${vw(17.067, 'xs')} ${vw(23.893, 'xs')};
    text-align: center;
    color: ${color('textPrimary')};
    opacity: 0.72;
`;
