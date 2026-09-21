import React, { useEffect, useRef, useState } from 'react';
import { Container } from './AppWrapper.styled';
import { AppProps } from 'next/app';
import GlobalStyle from '@/style/globalStyles';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import { TransitionTimeoutState, TransitionTransitState } from '@/recoil/transitionState/athom';
import TransitionLayer from '@/components/common/TransitionLayer/TransitionLayer';
import Preloader from '@/components/common/Preloader/Preloader';
import Header from '@/components/common/Header/Header';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import useDisableScrollToTop from '@/hooks/useDisableScrollToTop';

interface DisplayedPage {
    path: string;
    Component: AppProps['Component'];
    pageProps: AppProps['pageProps'];
}

const AppWrapper: React.FC<AppProps> = ({ Component, pageProps, router }) => {
    const { asPath } = router;
    const [transit, setTransit] = useRecoilState(TransitionTransitState);
    const [timeout, setTimeoutState] = useRecoilState(TransitionTimeoutState);

    // Инерционный скролл — только там, где скроллится сама страница.
    // На инструментах (tree/cemetery, variant: 'app') колесо занято зумом/таймлайном.
    useSmoothScroll(pageProps?.header?.variant !== 'app');

    // Убираем «прыжок» страницы наверх при переходах между маршрутами.
    useDisableScrollToTop();

    useEffect(() => {
        setTimeoutState(800);
    }, [asPath, setTimeoutState]);

    // props обновляются вместе с рендером, поэтому держим ссылку на самые свежие,
    // чтобы зафиксировать страницу в момент завершения навигации.
    const latestPageRef = useRef<DisplayedPage>({ path: asPath, Component, pageProps });
    latestPageRef.current = { path: asPath, Component, pageProps };

    // Отображаемая страница меняется только по routeChangeComplete. Если переключать
    // страницу сразу при смене маршрута, новый компонент монтируется со старыми
    // pageProps: i18n ещё не содержит его неймспейсы, и вместо текста рендерятся
    // ключи переводов («имена переменных»).
    const [displayedPage, setDisplayedPage] = useState<DisplayedPage>(() => ({ path: asPath, Component, pageProps }));
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const handleRouteChangeStart = () => setIsNavigating(true);
        const handleRouteChangeComplete = (url: string) => {
            setIsNavigating(false);
            const { Component: resolvedComponent, pageProps: resolvedPageProps } = latestPageRef.current;
            setDisplayedPage({ path: url, Component: resolvedComponent, pageProps: resolvedPageProps });
        };
        const handleRouteChangeError = () => setIsNavigating(false);

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);
        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router]);

    // Страховка: если зафиксированная страница разошлась с актуальной (например,
    // событие complete не пришло), синхронизируемся после завершения навигации.
    useEffect(() => {
        if (!isNavigating && (displayedPage.path !== asPath || displayedPage.Component !== Component)) {
            setDisplayedPage({ path: asPath, Component, pageProps });
        }
    }, [isNavigating, asPath, Component, pageProps, displayedPage]);

    return (
        <Container>
            <GlobalStyle />
            {/* Header живёт вне SwitchTransition: он не участвует в переходе,
                не размонтируется вместе со старой страницей и не скрывается
                за TransitionLayer. Рендерим его только если страница
                предоставляет конфиг header (системные страницы Next, например
                /404, его не имеют и работают без i18n-провайдера). */}
            {displayedPage.pageProps?.header ? <Header {...displayedPage.pageProps.header} /> : null}
            <SwitchTransition>
                <Transition
                    key={displayedPage.path}
                    timeout={timeout}
                    onEnter={() => setTransit(false)}
                    onExit={() => setTransit(true)}
                >
                    <displayedPage.Component {...displayedPage.pageProps} />
                </Transition>
            </SwitchTransition>
            <TransitionLayer visible={transit} />
            <Preloader />
        </Container>
    );
};

export default AppWrapper;
