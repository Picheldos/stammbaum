import { atom } from 'recoil';

const initialState = {
    transit: false,
    timeout: 800,
    multipageTransition: false
};

export const TransitionTransitState = atom({
    key: 'TransitionTransitState',
    default: initialState.transit
});

export const TransitionTimeoutState = atom({
    key: 'TransitionTimeoutState',
    default: initialState.timeout
});

export const MultipageTransitionState = atom({
    key: 'MultipageTransitionState',
    default: initialState.multipageTransition
});
