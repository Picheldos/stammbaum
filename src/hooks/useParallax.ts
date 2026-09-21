import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ParallaxOptions {
    /** Смещение по Y в начале прохода элемента через вьюпорт, px. */
    from?: number;
    /** Смещение по Y в конце прохода, px. Разница from→to задаёт «глубину». */
    to?: number;
    /** Отключить эффект (например, на мобильных или когда элемента ещё нет). */
    disabled?: boolean;
}

/**
 * Параллакс, привязанный к скроллу через GSAP ScrollTrigger (`scrub`).
 *
 * Элемент плавно смещается по оси Y, пока проходит через вьюпорт: разные
 * `to` у соседних слоёв дают ощущение глубины. Трансформ не влияет на поток
 * документа, поэтому высота страницы и скролл не меняются.
 *
 * Уважает `prefers-reduced-motion` и корректно очищается через `gsap.context`.
 */
const useParallax = <T extends HTMLElement>(ref: RefObject<T>, { from = 0, to = -80, disabled = false }: ParallaxOptions = {}): void => {
    useEffect(() => {
        const el = ref.current;
        if (!el || disabled || typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { y: from },
                {
                    y: to,
                    ease: 'none',
                    force3D: true,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [ref, from, to, disabled]);
};

export default useParallax;
