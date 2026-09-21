import { RefObject, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Инерционная горизонтальная прокрутка скролл-контейнера колёсиком мыши.
 *
 * Тот же приём, что и в {@link useSmoothScroll} (lerp к целевой позиции через
 * GSAP ticker), но применённый к `scrollLeft` собственного контейнера, а не к
 * `window`. И вертикальный, и горизонтальный delta колеса двигают линию по
 * горизонтали — как и ожидается от горизонтального таймлайна кладбища.
 *
 * Инерция включается только на десктопе с точным указателем и без
 * `prefers-reduced-motion`; на тач-устройствах и при сокращённой анимации
 * остаётся нативный скролл. У краёв событие отдаётся странице.
 */
// Доля пути до цели за кадр. Ниже — плавнее и медленнее догоняет.
// 0.10 = 0.12 / 1.2, т.е. анимация на ~20% медленнее прежней.
const EASE = 0.1;

interface SmoothScrollXOptions {
    /** Отключить перехват (например, на мобильной вертикальной раскладке). */
    enabled?: boolean;
    /** Множитель дельты колеса для более быстрого/медленного хода. */
    speed?: number;
}

const useSmoothScrollX = (
    ref: RefObject<HTMLElement>,
    { enabled = true, speed = 1 }: SmoothScrollXOptions = {}
): void => {
    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled || typeof window === 'undefined') return;

        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!finePointer || reduceMotion) return;

        let target = el.scrollLeft;
        let current = el.scrollLeft;
        let running = false;

        const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

        const tick = () => {
            current += (target - current) * EASE;
            if (Math.abs(target - current) < 0.5) {
                current = target;
                el.scrollLeft = current;
                stop();
                return;
            }
            el.scrollLeft = current;
        };

        const start = () => {
            if (!running) {
                running = true;
                gsap.ticker.add(tick);
            }
        };

        function stop() {
            if (running) {
                running = false;
                gsap.ticker.remove(tick);
            }
        }

        const onWheel = (event: WheelEvent) => {
            // Ctrl+wheel — зум браузера; уже обработанные события не трогаем.
            if (event.ctrlKey || event.defaultPrevented) return;
            const max = maxScroll();
            if (max <= 0) return; // нечего скроллить — оставляем нативное поведение

            // Берём доминирующую ось, чтобы работали и обычные, и трекпад-жесты.
            const raw = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
            // Firefox отдаёт delta в «строках» (deltaMode === 1), некоторые — в «страницах» (2).
            const normalized =
                event.deltaMode === 1
                    ? raw * 16
                    : event.deltaMode === 2
                      ? raw * el.clientWidth
                      : raw;
            const delta = normalized * speed;
            if (delta === 0) return;

            // У краёв не перехватываем — пусть прокручивается страница.
            const atStart = target <= 0 && delta < 0;
            const atEnd = target >= max && delta > 0;
            if (atStart || atEnd) return;

            event.preventDefault();
            target = Math.min(max, Math.max(0, target + delta));
            start();
        };

        // Скроллбар, клавиатура, программный scrollTo — синхронизируем цель,
        // пока инерция колеса не активна, чтобы ходы не конфликтовали.
        const syncTarget = () => {
            if (!running) {
                target = el.scrollLeft;
                current = el.scrollLeft;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('scroll', syncTarget, { passive: true });

        return () => {
            stop();
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('scroll', syncTarget);
        };
    }, [ref, enabled, speed]);
};

export default useSmoothScrollX;
