import styled from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';

export const PageShell = styled.div`
    display: flex;
    flex-direction: column;
    /* Header теперь рендерится в AppWrapper над PageShell и не участвует
       в переходах, поэтому shell занимает всё место под ним. */
    flex: 1 0 auto;
    background-color: ${color('cream')};
`;

export const MainArea = styled.main`
    flex: 1 0 auto;
    width: 100%;
    position: relative;
    padding: 0 ${vw(8.533, 'xs')};

    ${mediaBreakpointUp('lg')} {
        padding: 0 ${vw(20)};
    }

`;
