const colors = {
    white: '#FFFFFF',
    gray: '#d4d4d4',
    lightGray: '#f2f2f2',
    darkGray: '#98918C',
    black: '#000000',
    brown: '#231818',
    darkBrown: '#231718',
    beige: '#FBFBEF',
    darkBeige: '#EBEBDB',
    color228: '#081e01',
    color1337: '#fbfdfb',
    popupBackground: '#F8EACF',
    /** Stammbaum — топ-бар и акценты */
    forest: '#64774A',
    forestDeep: '#2F4F3A',
    cream: '#FFFCF6',
    creamWarm: '#F5E9D3',
    slateBlue: '#4F5D75',
    navActive: '#5B6D8E',
    textPrimary: '#333333',
    ink: '#30302A',
    /** Landing */
    landingPaper: '#F9F8F0',
    landingCard: '#EFD195',
    landingCta: '#576686',
    landingStepNum: '#C5CAC7',
        treeStub: '#9AA89B',
    treeStubTrunk: '#7D6B5A',
    avatarStub: '#BDB4A8',
    /** Cemetery ("Virtual Cemetery") — extended palette, single source of truth */
    meadowBlue: '#576686',
    cemeteryGray: '#5A5A5A',
    cemeteryBorder: '#5D5D5D',
    cemeteryBorderAlt: '#6F654D'
};

export type Colors = keyof typeof colors;

export default colors;
