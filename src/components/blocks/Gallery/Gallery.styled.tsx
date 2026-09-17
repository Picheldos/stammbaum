import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div`
    display: flex;
    flex-direction: row;

    width: 100%;
    margin-bottom: ${vw(14, 'xs')};

    ${mediaBreakpointUp('xl')} {
        width: ${vw(580)};
        margin-bottom: 0;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .swiper {
        width: 100%;
        position: relative;

        .swiper-slide {
            width: fit-content;
            margin-right: ${vw(11.947, 'xs')};
        }
    }
`;
export const GalleryImage = styled.div`
    position: relative;
    width: ${vw(136.533, 'xs')};
    height: ${vw(170.667, 'xs')};

    img {
        object-fit: cover;
        object-position: center;
    }

    ${mediaBreakpointUp('xl')} {
        width: ${vw(250)};
        height: ${vw(320)};

        margin-top: ${vw(50)};
    }
`;
