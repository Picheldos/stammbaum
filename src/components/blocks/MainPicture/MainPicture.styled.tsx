import styled from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    display: flex;
    flex-direction: row;

    position: relative;

    width: 100%;
    height: ${vw(533.333, 'xs')};

    margin-bottom: ${vw(14, 'xs')};

    img {
        object-fit: cover;
        object-position: center;
    }

    & > span {
        width: 100vw !important;
        transform: translateX(${vw(-23.04, 'xs')});
    }

    ${mediaBreakpointUp('xl')} {
        height: ${vw(693)};
        margin-bottom: 0;

        & > span {
            width: 100% !important;
            transform: none;
        }
    }
`;

export const MainPictureLabel = styled.div`
    position: absolute;
    height: ${vw(105, 'xs')};
    width: 100%;
    transform: scale(0.8);

    top: ${vw(396.8, 'xs')};

    ${mediaBreakpointUp('xl')} {
        top: ${vw(24)};
        left: ${vw(594)};
        transform: scale(0.85);

        height: ${vw(158)};
        width: ${vw(645)};
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

    width: ${vw(213.333, 'xs')};
    top: ${vw(473.6, 'xs')};
    left: ${vw(30.72, 'xs')};

    ${mediaBreakpointUp('xl')} {
        display: none;
    }

    a {
        width: fit-content;
    }
`;

export const MainPictureMenuItem = styled.div`
    ${font('label')};
    color: ${color('white')};

    width: fit-content;
`;
