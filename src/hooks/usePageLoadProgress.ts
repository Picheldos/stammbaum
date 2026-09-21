import { useEffect, useRef, useState } from 'react';

export interface PageLoadProgress {
    /** Прогресс загрузки в диапазоне 0..1 */
    progress: number;
    /** true, когда страница загружена и заливка логотипа завершена */
    complete: boolean;
}

/** Потолок авто-разгона до появления реального сигнала о загрузке */
const RAMP_TARGET = 0.9;
/** Время (мс) выхода на RAMP_TARGET */
const RAMP_DURATION = 1400;
/** Жёсткий предел (мс): прелоадер завершится в любом случае */
const FAILSAFE = 5000;
/** Коэффициент сглаживания приближения к цели */
const EASING = 0.12;

const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Возвращает прогресс начальной загрузки страницы.
 *
 * Прогресс совмещает реальные сигналы (window `load` + `document.fonts.ready`)
 * с плавным авто-разгоном, поэтому заливка анимируется красиво и всегда доходит до конца.
 */
export default function usePageLoadProgress(): PageLoadProgress {
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);
    const currentRef = useRef(0);
    const loadedRef = useRef(false);

    useEffect(() => {
        if (prefersReducedMotion()) {
            setProgress(1);
            setComplete(true);
            return;
        }

        let raf = 0;
        const start = performance.now();

        const fontsReady: Promise<unknown> =
            typeof document !== 'undefined' && 'fonts' in document ? document.fonts.ready : Promise.resolve();

        const markLoaded = () => {
            void Promise.resolve(fontsReady).finally(() => {
                loadedRef.current = true;
            });
        };

        if (document.readyState === 'complete') {
            markLoaded();
        } else {
            window.addEventListener('load', markLoaded, { once: true });
        }

        const tick = (now: number) => {
            const elapsed = now - start;

            // easeOutCubic авто-разгон до RAMP_TARGET
            const rampT = Math.min(elapsed / RAMP_DURATION, 1);
            const eased = 1 - Math.pow(1 - rampT, 3);
            let target = eased * RAMP_TARGET;

            if (loadedRef.current || elapsed >= FAILSAFE) {
                target = 1;
            }

            // плавно приближаемся к цели, не откатываясь назад
            currentRef.current += (target - currentRef.current) * EASING;
            if (target >= 1 && currentRef.current > 0.997) {
                currentRef.current = 1;
            }
            setProgress(currentRef.current);

            if (currentRef.current < 1) {
                raf = requestAnimationFrame(tick);
            }
        };

        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('load', markLoaded);
        };
    }, []);

    useEffect(() => {
        if (progress >= 1 && !complete) {
            const t = setTimeout(() => setComplete(true), 250);
            return () => clearTimeout(t);
        }
    }, [progress, complete]);

    return { progress, complete };
}
