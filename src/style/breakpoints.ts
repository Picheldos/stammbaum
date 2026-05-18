const breakpoints = {
    xs: 375,
    sm: 576,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440,
    mac: 1512,
    fhd: 1920,
    qhd: 2560,
    uhd: 3840
};

export type Breakpoints = keyof typeof breakpoints;

export default breakpoints;
