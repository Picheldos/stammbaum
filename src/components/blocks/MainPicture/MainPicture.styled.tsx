import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    display: flex;
    flex-direction: row;

    position: relative;

    width: 100%;
    height: ${vw(625, 'xs')};

    margin-bottom: 14px;

    & > span {
        width: 100vw !important;
        transform: translateX(${vw(-27, 'xs')});
    }

    ${mediaBreakpointUp('xl')} {
        height: ${vw(693, 'mac')};
        margin-bottom: 0;

        & > span {
            width: 100% !important;
            transform: none;
        }
    }
`;

export const MainPictureLabel = styled.div`
    position: absolute;
    height: 105px;
    width: 100%;
    transform: scale(0.8);

    top: ${vw(465, 'xs')};

    ${mediaBreakpointUp('xl')} {
        top: ${vw(24, 'mac')};
        left: ${vw(594, 'mac')};
        transform: scale(0.85);

        height: ${vw(158, 'mac')};
        width: ${vw(645, 'mac')};
    }

    &,
    img {
        pointer-events: none;
    }
`;

export const MainPictureMenu = styled.div`
    position: absolute;
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    width: ${vw(250, 'xs')};
    top: ${vw(555, 'xs')};
    left: ${vw(36, 'xs')};

    ${mediaBreakpointUp('xl')} {
        display: none;
    }

    a {
        width: fit-content;
    }
`;

export const MainPictureMenuItem = styled.div`
    ${font('font4')};
    color: ${color('white')};

    width: fit-content;
`;
