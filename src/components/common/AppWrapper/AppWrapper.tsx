import React, { useEffect } from 'react';
import { Container } from './AppWrapper.styled';
import { AppProps } from 'next/app';
import GlobalStyle from '@/style/globalStyles';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useRecoilState } from 'recoil';
import { TransitionTimeoutState, TransitionTransitState } from '@/recoil/transitionState/athom';
import TransitionLayer from '@/components/common/TransitionLayer/TransitionLayer';

const AppWrapper: React.FC<AppProps> = ({ Component, pageProps, router }) => {
    const { asPath } = router;
    const [transit, setTransit] = useRecoilState(TransitionTransitState);
    const [timeout, setTimeoutState] = useRecoilState(TransitionTimeoutState);

    useEffect(() => {
        setTimeoutState(800);
    }, [asPath, setTimeoutState]);

    return (
        <Container>
            <GlobalStyle />
            <SwitchTransition>
                <Transition key={asPath} timeout={timeout} onEnter={() => setTransit(false)} onExit={() => setTransit(true)}>
                    <Component {...pageProps} />
                </Transition>
            </SwitchTransition>
            <TransitionLayer visible={transit} />
        </Container>
    );
};

export default AppWrapper;
