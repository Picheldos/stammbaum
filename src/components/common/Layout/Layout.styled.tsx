import styled from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';

export const PageShell = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${color('cream')};
`;

export const MainArea = styled.main`
    flex: 1 0 auto;
    width: 100%;
    position: relative;
    padding: 0 ${vw(10, 'xs')} ${vw(36, 'xs')};

    ${mediaBreakpointUp('lg')} {
        padding: 60px 20px 0 20px;
    }
`;
