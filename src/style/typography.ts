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
    /* H1 */
    title: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(20, 22, 40, 70)};
        line-height: 1;
        font-weight: 500;

        @media (min-width: 1920px) {
            font-weight: 600;
        }
    `,

    /* H2 */
    title2: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(16, 18, 30, 50)};
        line-height: 1;
        font-weight: 500;
    `,

    /* H3 - Playfair Display */
    title3: css`
        font-family: var(--font-playfair-display), 'Playfair Display', Georgia, serif;
        ${remAdaptiveFont(16, 16, 20, 20)};
        line-height: 1;
        font-weight: 500;
    `,

    /* B3 */
    font1: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(8, 8, 14, 16)};
        line-height: 1.2;
        font-weight: 400;

        @media (min-width: 1280px) {
            font-weight: 500;
        }
    `,

    /* B1 */
    font2: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(12, 12, 20, 18)};
        line-height: 1.2;
        font-weight: 500;

        @media (min-width: 1280px) and (max-width: 1919px) {
            font-weight: 400;
        }
    `,

    /* H5 */
    font3: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(18, 18, 22, 22)};
        line-height: 1.2;
        font-weight: 500;
    `,

    /* B4 */
    font4: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(12, 12, 12, 14)};
        line-height: 1.2;
        font-weight: 500;
    `,

    /* B5 */
    font5: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(10, 10, 22, 22)};
        line-height: 1.2;
        font-weight: 500;
    `,

    /* H4 */
    font6: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(14, 14, 25, 30)};
        line-height: 1;
        font-weight: 500;
        font-style: normal;
        letter-spacing: 0;
    `,

    /* B2 */
    font7: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(8, 8, 16, 18)};
        line-height: 1;
        font-weight: 500;
        font-style: normal;
        letter-spacing: 0;
    `,

    /* B6 */
    font8: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(8, 8, 8, 8)};
        line-height: 1;
        font-weight: 400;
        font-style: normal;
        letter-spacing: 0;
    `,

    /* B7 */
    font9: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(5, 8, 8, 8)};
        line-height: 1;
        font-weight: 400;
        font-style: normal;
        letter-spacing: 0;

        @media (min-width: 1280px) {
            font-weight: 600;
        }
    `,

    logo: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
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
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(14, 14, 16, 16)};
        line-height: 1.2;
        font-weight: 500;
    `,
    
    stepIndex: css`
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
        ${remAdaptiveFont(38, 44, 60, 80)};
        line-height: 1.1;
        font-weight: 800;
    `
};



export type Typography = keyof typeof typography;

export default typography;
