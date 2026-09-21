import React, { useEffect, useState } from 'react';
import usePageLoadProgress from '@/hooks/usePageLoadProgress';
import { Overlay, LogoStack, Layer, Wordmark } from './Preloader.styled';

/** Длительность плавного исчезновения (должна совпадать с transition в Overlay) */
const FADE_MS = 600;

const Preloader: React.FC = () => {
    const { progress, complete } = usePageLoadProgress();
    const [unmounted, setUnmounted] = useState(false);

    // Снимаем прелоадер из DOM после завершения анимации исчезновения.
    useEffect(() => {
        if (!complete) return;
        const t = setTimeout(() => setUnmounted(true), FADE_MS);
        return () => clearTimeout(t);
    }, [complete]);

    // Блокируем прокрутку, пока прелоадер виден.
    useEffect(() => {
        if (typeof document === 'undefined' || unmounted) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, [unmounted]);

    if (unmounted) return null;

    const fillTop = `${(1 - progress) * 100}%`;
    const percent = Math.round(progress * 100);

    return (
        <Overlay
            $hidden={complete}
            role="progressbar"
            aria-label="Загрузка"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
        >
            <LogoStack aria-hidden style={{ '--fill': fillTop } as React.CSSProperties}>
                <Layer $variant="outline">
                    <Wordmark>Stammbaum</Wordmark>
                </Layer>
                <Layer $variant="fill">
                    <Wordmark>Stammbaum</Wordmark>
                </Layer>
            </LogoStack>
        </Overlay>
    );
};

export default Preloader;
