import styled from 'styled-components';
import { font, vw } from '@/style/mixins';

export const Body = styled.section`
    ${font('body')};
    padding-top: ${vw(32, 'xs')};
`;
