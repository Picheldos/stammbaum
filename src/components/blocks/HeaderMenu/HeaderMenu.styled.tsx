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
    margin-right: ${vw(21.333, 'xs')};
    svg,
    a {
        margin-top: 3px;
        width: ${vw(17.067, 'xs')};
        height: ${vw(19.627, 'xs')};

        ${mediaBreakpointUp('xl')} {
            width: ${vw(40)};
            height: ${vw(40)};
            margin-top: 0;
        }
    }

    &:hover {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        margin-right: ${vw(80)};
    }
`;

export const HeaderMenuItemBtn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: ${vw(13.653, 'xs')};

    span {
        width: ${vw(16.213, 'xs')};
        height: 2px;
        background: ${color('darkBrown')};
        border-radius: 5px;

        ${mediaBreakpointUp('xl')} {
            width: ${vw(48)};
            height: 3px;
        }
    }

    &:hover {
        cursor: pointer;
    }

    ${mediaBreakpointUp('xl')} {
        height: ${vw(38)};
    }
`;
