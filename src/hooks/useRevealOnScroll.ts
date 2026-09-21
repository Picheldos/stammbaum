import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// useLayoutEffect не работает на сервере — на SSR подменяем его на useEffect,
// чтобы избежать предупреждения Next.js и при этом применить начальное
// состояние до первой отрисовки в браузере (без «мигания» заголовка).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type RevealOnScrollOptions = {
    /** Смещение снизу в пикселях, откуда элемент выплывает. */
    y?: number;
    /** Длительность анимации в секундах. */
    duration?: number;
    /** Точка запуска ScrollTrigger (позиция триггера относительно вьюпорта). */
    start?: string;
};

/**
 * Плавное появление элемента при попадании во вьюпорт:
 * выход из прозрачности + выплывание снизу. Анимация проигрывается один раз.
 * Возвращает ref, который нужно повесить на анимируемый элемент.
 */
const useRevealOnScroll = <T extends HTMLElement = HTMLElement>({
    y = 40,
    duration = 3,
    start = 'top 85%'
}: RevealOnScrollOptions = {}) => {
    const ref = useRef<T>(null);

    useIsomorphicLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Уважаем системную настройку «уменьшить движение»: сразу показываем без анимации.
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            gsap.set(element, { opacity: 1, y: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                element,
                { opacity: 0, y },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start,
                        once: true
                    }
                }
            );
        }, element);

        return () => ctx.revert();
    }, [y, duration, start]);

    return ref;
};

export default useRevealOnScroll;
