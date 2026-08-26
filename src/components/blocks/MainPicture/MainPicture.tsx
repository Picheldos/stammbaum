import React from 'react';
import { Container, MainPictureLabel, MainPictureMenu, MainPictureMenuItem } from '@/components/blocks/MainPicture/MainPicture.styled';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { SizesState } from '@/recoil/commonState/athom';

export interface MainPictureProps {
    image: string;
}

const MainPicture: React.FC<MainPictureProps> = ({ image }) => {
    const { isMobile } = useRecoilValue(SizesState);

    return (
        <Container>
            <Image src={image} fill alt="main image" quality={100} style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="100vw" />

            <MainPictureLabel>
                <Image
                    src="/images/index/towear.webp"
                    alt="main label"
                    fill
                    quality={100}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    sizes="(max-width: 1280px) 100vw, 40vw"
                />
            </MainPictureLabel>

            <MainPictureMenu>
                <Link href="/catalogue">
                    <MainPictureMenuItem>Catalogue</MainPictureMenuItem>
                </Link>
                <Link href="/">
                    <MainPictureMenuItem>Contact us</MainPictureMenuItem>
                </Link>
                {!isMobile && (
                    <Link href="/about">
                        <MainPictureMenuItem>About</MainPictureMenuItem>
                    </Link>
                )}
            </MainPictureMenu>
        </Container>
    );
};

export default MainPicture;
