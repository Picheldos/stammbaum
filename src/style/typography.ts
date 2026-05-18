import { css, FlattenSimpleInterpolation } from 'styled-components';

export const rem: (size: number, rootFontSize?: number) => string = (size, rootFontSize = 16) => {
    return `${size / rootFontSize}rem`;
};

export const remFluidMiddle: (
    property: string,
    minSize: number,
    tabletSize: number,
    smallDeskSize: number,
    maxSize: number,
    rootFontSize?: number
) => FlattenSimpleInterpolation = (property, minSize, tabletSize, smallDeskSize, maxSize, rootFontSize = 16) => {
    const minSizeRem = rem(minSize);
    const tabletSizeRem = rem(tabletSize);
    const smallDeskSizeRem = rem(smallDeskSize);
    const maxSizeRem = rem(maxSize);

    return css`
        ${property}: ${rem(minSize * 0.8)};

        @media (min-width: 370px) {
            ${property}: ${minSizeRem};
        }

        @media (min-width: 500px) {
            ${property}: calc(${minSizeRem} + (${tabletSize / rootFontSize} - ${minSize / rootFontSize}) *
                            ((100vw - ${rem(370)}) / (767 - 370)));
        }

        @media (min-width: 767px) {
            ${property}: calc(${tabletSizeRem} + (${smallDeskSize / rootFontSize} - ${tabletSize / rootFontSize}) *
                            ((100vw - ${rem(767)}) / (1280 - 767)));

            @media (max-height: 500px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.6} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1280 - 767)));
            }

            @media (max-height: 750px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.7} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1280 - 767)));
            }
        }

        @media (min-width: 1280px) {
            ${property}: calc(${smallDeskSizeRem} + (${maxSize / rootFontSize} - ${smallDeskSize / rootFontSize}) *
                ((100vw - ${rem(1280)}) / (1920 - 1280)));

            @media (max-height: 500px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.6} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1920 - 767)));
            }

            @media (max-height: 750px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.7} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1920 - 767)));
            }
        }

        @media (min-width: 1920px) {
            ${property}: ${maxSizeRem};

            @media (max-height: 500px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.6} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1920 - 767)));
            }

            @media (max-height: 750px) {
                ${property}: calc(${minSizeRem} + (${(maxSize / rootFontSize) * 0.7} - ${minSize / rootFontSize}) *
                ((100vw - ${rem(767)}) / (1920 - 767)));
            }
        }

        @media (min-width: 2000px) {
            ${property}: ${(maxSize / 1920) * 100}vw;
        }
    `;
};
export const remAdaptiveFont = (minSize: number, tabletSize: number, smallDeskSize: number, maxSize: number): FlattenSimpleInterpolation => {
    return remFluidMiddle('font-size', minSize, tabletSize, smallDeskSize, maxSize, 16);
};

const typography = {
    title: css`
        ${remAdaptiveFont(25, 25, 45, 45)};
        line-height: 1;
        font-weight: 400;
    `,

    title2: css`
        ${remAdaptiveFont(20, 22, 40, 40)};
        line-height: 1;
        font-weight: 700;
    `,

    title3: css`
        ${remAdaptiveFont(22, 24, 30, 30)};
        line-height: 1;
        font-weight: 700;
    `,

    font1: css`
        ${remAdaptiveFont(12, 14, 23, 23)};
        line-height: 1.2;
        font-weight: 400;
    `,

    font2: css`
        ${remAdaptiveFont(16, 18, 30, 30)};
        line-height: 1.2;
        font-weight: 400;
    `,

    font3: css`
        ${remAdaptiveFont(19, 19, 32, 32)};
        line-height: 1.2;
        font-weight: 400;
    `,

    font4: css`
        ${remAdaptiveFont(12, 12, 18, 18)};
        line-height: 1.2;
        font-weight: 400;
    `,

    font5: css`
        ${remAdaptiveFont(15, 12, 25, 25)};
        line-height: 1.2;
        font-weight: 400;
    `,

    font6: css`
        ${remAdaptiveFont(20, 24, 35, 40)};
        line-height: 1;
        font-weight: 400;
        font-style: normal;
        letter-spacing: 0;
    `,

    font7: css`
        ${remAdaptiveFont(14, 16, 18, 20)};
        line-height: 1;
        font-weight: 400;
        font-style: normal;
        letter-spacing: 0;
    `,

    logo: css`
        ${remAdaptiveFont(28, 32, 55, 55)};
        line-height: 1;
        font-weight: 400;
    `,

    logoSerif: css`
        font-family: var(--font-playfair-display), 'Georgia', serif;
        ${remAdaptiveFont(22, 24, 32, 38)};
        line-height: 1.05;
        font-weight: 400;
        letter-spacing: 0.02em;
    `,

    headerNav: css`
        ${remAdaptiveFont(14, 14, 16, 16)};
        line-height: 1.2;
        font-weight: 500;
    `
};

export type Typography = keyof typeof typography;

export default typography;
