import styled from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    z-index: 100;
    margin-left: auto;
    align-items: center;
`;

export const HeaderMenuItem = styled.div`
    margin-right: ${vw(25, 'xs')};
    svg,
    a {
        margin-top: 3px;
        width: ${vw(20, 'xs')};
        height: ${vw(23, 'xs')};

        ${mediaBreakpointUp('xl')} {
            width: ${vw(40, 'mac')};
            height: ${vw(40, 'mac')};
            margin-top: 0;
        }
    }

    &:hover {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        margin-right: ${vw(80, 'mac')};
    }
`;

export const HeaderMenuItemBtn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: ${vw(16, 'xs')};

    span {
        width: ${vw(19, 'xs')};
        height: 2px;
        background: ${color('darkBrown')};
        border-radius: 5px;

        ${mediaBreakpointUp('xl')} {
            width: ${vw(48, 'mac')};
            height: 3px;
        }
    }

    &:hover {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        height: ${vw(38, 'mac')};
    }
`;
