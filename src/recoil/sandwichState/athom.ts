import { atom } from 'recoil';

const initialState = {
    open: false
};

export const SandwichState = atom({
    key: 'SandwichState',
    default: initialState.open
});
