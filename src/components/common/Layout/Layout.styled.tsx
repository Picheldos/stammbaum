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
    padding: 0 ${vw(27, 'xs')} ${vw(36, 'xs')};

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    ${mediaBreakpointUp('lg')} {
        padding: 60px 20px 0 20px;
    }
`;
