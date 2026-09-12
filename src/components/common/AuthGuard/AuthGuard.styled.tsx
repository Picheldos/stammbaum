import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Gate = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: ${vw(192, 'xs')};
    padding: ${vw(40, 'xs')} ${vw(16, 'xs')};
    text-align: center;
    color: ${color('textPrimary')};
    ${font('body')};
`;
