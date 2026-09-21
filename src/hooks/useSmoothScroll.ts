import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Плавный (инерционный) скролл страницы.
 *
 * Не подменяет нативный скролл трансформом (как ScrollSmoother), а лишь
 * догоняет целевую позицию через `window.scrollTo`, поэтому `position: sticky`
 * у шапки и `position: fixed` у Sandwich продолжают работать штатно.
 *
 * Включается только на десктопе с точным указателем и при отсутствии
 * `prefers-reduced-motion`. Колесо внутри собственных скроллящихся контейнеров
 * (попапы и т.п.) не перехватывается.
 *
 * @param enabled — включать инерцию только там, где скроллится сама страница
 * (маркетинговые страницы). На страницах-инструментах (`tree`, `cemetery`)
 * колесо занято зумом/таймлайном, поэтому там передаётся `false`.
 */
const EASE = 0.1;

const useSmoothScroll = (enabled: boolean): void => {
    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!finePointer || reduceMotion) return;

        let target = window.scrollY;
        let current = window.scrollY;
        let running = false;

        const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        // true, если колесо крутят над контейнером с собственным вертикальным скроллом
        const overInnerScroller = (node: EventTarget | null): boolean => {
            let el = node as HTMLElement | null;
            while (el && el !== document.body && el !== document.documentElement) {
                const { overflowY } = getComputedStyle(el);
                if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
                    return true;
                }
                el = el.parentElement;
            }
            return false;
        };

        const tick = () => {
            current += (target - current) * EASE;
            if (Math.abs(target - current) < 0.5) {
                current = target;
                window.scrollTo(0, current);
                stop();
                return;
            }
            window.scrollTo(0, current);
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
            // Ctrl+wheel — это зум браузера/страницы, не трогаем.
            if (event.ctrlKey || event.defaultPrevented) return;
            if (overInnerScroller(event.target)) return;

            event.preventDefault();
            // Firefox отдаёт deltaY в «строках» (deltaMode === 1).
            const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
            target = Math.min(maxScroll(), Math.max(0, target + delta));
            start();
        };

        // Скролл клавиатурой, перетаскивание ползунка, программный скролл —
        // синхронизируем цель, пока инерция не активна.
        const syncTarget = () => {
            if (!running) {
                target = window.scrollY;
                current = window.scrollY;
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('scroll', syncTarget, { passive: true });
        window.addEventListener('resize', syncTarget);

        return () => {
            stop();
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('scroll', syncTarget);
            window.removeEventListener('resize', syncTarget);
        };
    }, [enabled]);
};

export default useSmoothScroll;
