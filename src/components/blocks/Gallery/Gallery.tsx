import React from 'react';
import { Container, GalleryImage } from '@/components/blocks/Gallery/Gallery.styled';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { SizesState } from '@/recoil/commonState/athom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper';

export interface GalleryProps {
    images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const { isMobile } = useRecoilValue(SizesState);

    const COOMMON_SWIPER_OPTIONS: SwiperOptions = {
        slidesPerView: 'auto',
        speed: 1500,
        loop: true,
        effect: 'fade'
    };

    return (
        <Container>
            {isMobile ? (
                <Swiper {...COOMMON_SWIPER_OPTIONS}>
                    {images.map((imageSrc) => (
                        <SwiperSlide key={imageSrc}>
                            <GalleryImage>
                                <Image
                                    src={imageSrc}
                                    fill
                                    alt="product image"
                                    quality={100}
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                    sizes="40vw"
                                />
                            </GalleryImage>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                images.map((imageSrc) => (
                    <GalleryImage key={imageSrc}>
                        <Image
                            src={imageSrc}
                            fill
                            alt="Catalogue"
                            quality={100}
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            sizes="(max-width: 1280px) 160px, 250px"
                        />
                    </GalleryImage>
                ))
            )}
        </Container>
    );
};

export default Gallery;
