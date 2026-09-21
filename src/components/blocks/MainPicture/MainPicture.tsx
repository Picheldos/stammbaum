import React from 'react';
import { Container, MainPictureLabel, MainPictureMenu, MainPictureMenuItem } from '@/components/blocks/MainPicture/MainPicture.styled';
import Image from 'next/image';
import Link from 'next/link';

export interface MainPictureProps {
    image: string;
}

const MainPicture: React.FC<MainPictureProps> = ({ image }) => {
    return (
        <Container>
            <Image src={image} fill alt="main image" quality={100} sizes="100vw" />

            <MainPictureLabel>
                <Image
                    src="/images/index/towear.webp"
                    alt="main label"
                    fill
                    quality={100}
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
            </MainPictureMenu>
        </Container>
    );
};

export default MainPicture;
