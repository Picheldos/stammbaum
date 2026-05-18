import React, { useState } from 'react';
import { Container } from '@/components/blocks/Video/Video.styled';
import Button from '@/components/ui/Button/Button';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export interface VideoProps {
    video: string;
}

const Video: React.FC<VideoProps> = ({ video }) => {
    const router = useRouter();
    const { t } = useTranslation(['index']);
    const [videoLoadState, setVideoLoadState] = useState(false);

    const onReadyToPlay = () => {
        setVideoLoadState(true);
    };

    const clickHandler = () => {
        router.push('/catalogue');
    };

    return (
        <Container>
            <ReactPlayer
                playing={videoLoadState}
                url={video}
                width="100%"
                height="100%"
                loop
                muted
                playsInline
                onReady={onReadyToPlay}
            />
            <Button text={t('catalogue')} onClick={clickHandler} />
        </Container>
    );
};

export default Video;
