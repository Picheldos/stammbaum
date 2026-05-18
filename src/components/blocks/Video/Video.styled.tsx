import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';
import { Container as Button } from '@/components/ui/Button/Button.styled';

export const Container = styled.div`
    position: relative;
    display: flex;

    width: ${vw(160, 'xs')};
    height: ${vw(280, 'xs')};

    ${mediaBreakpointUp('xl')} {
        width: ${vw(590, 'mac')};
        height: ${vw(1059.5, 'mac')};
        margin: ${vw(50, 'mac')} 0 0 auto;
    }

    ${Button} {
        position: absolute;
        top: ${vw(200, 'xs')};
        left: calc(${vw(30, 'xs')});

        ${mediaBreakpointUp('xl')} {
            bottom: ${vw(188, 'mac')};
            left: ${vw(116, 'mac')};
            width: ${vw(358, 'mac')};
            height: ${vw(54, 'mac')};
        }
    }
`;
