import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    display: flex;
    flex-direction: row;

    width: 100%;
    margin-bottom: 14px;

    ${mediaBreakpointUp('xl')} {
        width: ${vw(580, 'mac')};
        margin-bottom: 0;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .swiper {
        width: 100%;
        position: relative;

        .swiper-slide {
            width: fit-content;
            margin-right: ${vw(14, 'xs')};
        }
    }
`;
export const GalleryImage = styled.div`
    position: relative;
    width: ${vw(160, 'xs')};
    height: ${vw(200, 'xs')};

    ${mediaBreakpointUp('xl')} {
        width: ${vw(250, 'mac')};
        height: ${vw(320, 'mac')};

        margin-top: ${vw(50, 'mac')};
    }
`;
