import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';
import { Container as Button } from '@/components/ui/Button/Button.styled';

export const Container = styled.div`
    position: relative;
    display: flex;

    width: ${vw(136.533, 'xs')};
    height: ${vw(238.933, 'xs')};

    ${mediaBreakpointUp('xl')} {
        width: ${vw(590)};
        height: ${vw(1059.5)};
        margin: ${vw(50)} 0 0 auto;
    }

    ${Button} {
        position: absolute;
        top: ${vw(170.667, 'xs')};
        left: calc(${vw(25.6, 'xs')});

        ${mediaBreakpointUp('xl')} {
            bottom: ${vw(188)};
            left: ${vw(116)};
            width: ${vw(358)};
            height: ${vw(54)};
        }
    }
`;
