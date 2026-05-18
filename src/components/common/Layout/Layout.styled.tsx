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

    ${mediaBreakpointUp('xl')} {
        padding: 0 ${vw(128, 'mac')} ${vw(56, 'mac')};
    }
`;
