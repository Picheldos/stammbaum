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
        ${property}: ${minSizeRem};

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
export const remAdaptiveFont = (
    minSize: number,
    tabletSize: number,
    smallDeskSize: number,
    maxSize: number
): FlattenSimpleInterpolation => {
    return remFluidMiddle('font-size', minSize, tabletSize, smallDeskSize, maxSize, 16);
};

/**
 * Точечный оверрайд под UI-kit Desktop 1200px.
 * Окно 1200-1439px (= xl из breakpoints.ts: xl 1200, xxl 1440).
 * Ниже 1200 и выше 1439 — старый CSS: mobile и FHD не меняются.
 */
export const xlOnly: (property: string, value: string) => FlattenSimpleInterpolation = (property, value) => {
    return css`
        @media (min-width: 1200px) and (max-width: 1439px) {
            ${property}: ${value};
        }
    `;
};

export const xlFontSize: (sizePx: number) => FlattenSimpleInterpolation = (sizePx) => {
    return xlOnly('font-size', `${sizePx}px`);
};

const sans = "var(--font-manrope), 'Manrope', Arial, sans-serif";
const serif = "var(--font-playfair-display), 'Playfair Display', Georgia, serif";

/**
 * Semantic typography roles shared by every page. The legacy names remain as
 * aliases so existing components can migrate without changing visual intent.
 */
const typography = {
    display: css`
        font-family: ${sans};
        ${remAdaptiveFont(20, 22, 40, 70)};
        ${xlFontSize(40)};
        line-height: 1;
        font-weight: 500;
        @media (min-width: 1920px) {
            font-weight: 600;
        }
    `,
    sectionTitle: css`
        font-family: ${sans};
        ${remAdaptiveFont(16, 18, 30, 50)};
        ${xlFontSize(30)};
        line-height: 1;
        font-weight: 500;
    `,
    serifTitle: css`
        font-family: ${serif};
        ${remAdaptiveFont(16, 16, 20, 20)};
        ${xlFontSize(20)};
        line-height: 1;
        font-weight: 400;
        ${xlOnly('font-weight', '500')};
    `,
    body: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 20, 18)};
        ${xlFontSize(20)};
        line-height: 1.2;
        font-weight: 400;
    `,
    bodySmall: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 16, 18)};
        ${xlFontSize(16)};
        line-height: 1.366;
        font-weight: 400;
    `,
    bodyLarge: css`
        font-family: ${sans};
        ${remAdaptiveFont(18, 18, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.2;
        font-weight: 500;
    `,
    label: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 12, 14)};
        line-height: 1.366;
        font-weight: 500;
    `,
    labelStrong: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 12, 14)};
        line-height: 1.366;
        font-weight: 600;
    `,
    cardTitle: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.1;
        font-weight: 500;
    `,
    cardTitleStrong: css`
        font-family: ${sans};
        ${remAdaptiveFont(18, 18, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.2;
        font-weight: 700;
    `,
    button: css`
        font-family: ${sans};
        ${remAdaptiveFont(18, 18, 18, 22)};
        ${xlFontSize(18)};
        line-height: 1.2;
        font-weight: 600;
    `,
    buttonSmall: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 16, 18)};
        ${xlFontSize(16)};
        line-height: 1.366;
        font-weight: 600;
    `,
    input: css`
        font-family: ${sans};
        ${remAdaptiveFont(16, 16, 16, 16)};
        line-height: 1.2;
        font-weight: 400;
    `,
    step: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.1;
        font-weight: 500;
    `,
    stepCopy: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.1;
        font-weight: 500;
    `,
    personName: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 8, 8)};
        line-height: 1;
        font-weight: 400;
    `,
    personNameStrong: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 8, 8)};
        line-height: 1.1;
        font-weight: 600;
    `,
    personMeta: css`
        font-family: ${sans};
        ${remAdaptiveFont(5, 8, 8, 8)};
        line-height: 1.366;
        font-weight: 400;
        @media (min-width: 1280px) {
            font-weight: 600;
        }
    `,
    personMetaStrong: css`
        font-family: ${sans};
        ${remAdaptiveFont(5, 8, 8, 8)};
        line-height: 1.366;
        font-weight: 600;
    `,
    personLifespan: css`
        font-family: ${sans};
        ${remAdaptiveFont(5, 8, 8, 8)};
        line-height: 1.366;
        font-weight: 500;
    `,
    logo: css`
        font-family: ${sans};
        ${remAdaptiveFont(28, 32, 55, 55)};
        ${xlFontSize(55)};
        line-height: 1;
        font-weight: 400;
    `,
    logoSerif: css`
        font-family: ${serif};
        ${remAdaptiveFont(16, 16, 20, 20)};
        ${xlFontSize(20)};
        line-height: 1;
        font-weight: 400;
        ${xlOnly('font-weight', '500')};
        @media (min-width: 1920px) {
            font-weight: 500;
        }
        letter-spacing: 0.02em;
    `,
    navigation: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 14, 14)};
        line-height: 1.366;
        font-weight: 500;
    `,
    navigationStrong: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 14, 14)};
        line-height: 1.366;
        font-weight: 600;
        ${xlOnly('font-weight', '500')};
    `,
    tab: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 16, 16)};
        ${xlFontSize(16)};
        line-height: 1.2;
        font-weight: 500;
    `,
    tabActive: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 16, 16)};
        ${xlFontSize(16)};
        line-height: 1.2;
        font-weight: 600;
    `,
    error: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 12, 12)};
        line-height: 1.366;
        font-weight: 500;
    `,
    mobileHeader: css`
        font-family: ${sans};
        ${remAdaptiveFont(16, 16, 16, 16)};
        line-height: 1.366;
        font-weight: 500;
    `,
    mobileBody: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 22, 22)};
        ${xlFontSize(22)};
        line-height: 1.1;
        font-weight: 500;
    `,
    mobileControl: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 12, 12)};
        line-height: 1.366;
        font-weight: 500;
    `,
    mobileAction: css`
        font-family: ${sans};
        ${remAdaptiveFont(14, 14, 14, 14)};
        line-height: 1.1;
        font-weight: 500;
    `,
    mobileAuxiliary: css`
        font-family: ${sans};
        ${remAdaptiveFont(10, 10, 10, 10)};
        line-height: 1.366;
        font-weight: 500;
    `,
    mobileMicroLink: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 8, 8)};
        line-height: 1.366;
        font-weight: 500;
        @media (min-width: 1920px) {
            font-weight: 400;
        }
    `,
    mobileUpload: css`
        font-family: ${sans};
        ${remAdaptiveFont(12, 12, 12, 12)};
        line-height: 1.366;
        font-weight: 500;
    `,
    mobileOptionalAction: css`
        font-family: ${sans};
        ${remAdaptiveFont(8, 8, 8, 8)};
        line-height: 1.366;
        font-weight: 500;
    `,
    landingHeading: css`
        font-family: ${sans};
        ${remAdaptiveFont(20, 20, 50, 50)};
        ${xlFontSize(30)};
        line-height: 1.1;
        font-weight: 500;
    `,
    landingStepHeading: css`
        font-family: ${sans};
        ${remAdaptiveFont(20, 20, 50, 50)};
        ${xlFontSize(30)};
        line-height: 1.366;
        font-weight: 500;
    `,
    heroTitle: css`
        font-family: ${sans};
        ${remAdaptiveFont(20, 22, 40, 70)};
        ${xlFontSize(40)};
        line-height: 1.1;
        font-weight: 500;
        @media (min-width: 1920px) {
            font-weight: 600;
        }
    `,
    stepIndex: css`
        font-family: ${sans};
        ${remAdaptiveFont(38, 44, 60, 80)};
        ${xlFontSize(60)};
        line-height: 1.1;
        font-weight: 700;
    `
};

/**
 * Legacy names are aliases, not independent styles. Keeping the mapping here
 * lets existing call sites migrate incrementally without creating divergent
 * typography definitions.
 */
const typographyWithLegacyAliases = {
    ...typography,
    title: typography.display,
    title2: typography.sectionTitle,
    title3: typography.serifTitle,
    font1: typography.body,
    font2: typography.body,
    font3: typography.bodyLarge,
    font4: typography.label,
    font5: typography.cardTitle,
    font6: typography.step,
    font7: typography.bodySmall,
    font8: typography.personName,
    font9: typography.personMeta,
    headerNav: typography.navigation
};

export type Typography = keyof typeof typographyWithLegacyAliases;

export default typographyWithLegacyAliases;
