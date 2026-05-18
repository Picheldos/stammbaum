import { atom } from 'recoil';

const initialStateSizes = {
    sizes: { w: 0, h: 0 },
    isMobile: false
};

export const SizesState = atom({
    key: 'SizesState',
    default: initialStateSizes
});
