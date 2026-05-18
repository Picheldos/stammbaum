import breakpoints, { Breakpoints } from './breakpoints';
import variables, { Offset, FontFamily } from './variables';
import colors, { Colors } from './colors';
import typography, { Typography } from './typography';
import { css, FlattenSimpleInterpolation } from 'styled-components';
import { rgba } from 'polished';

export const mediaBreakpointUp: (breakpoint: Breakpoints) => string = (breakpoint) => {
    return `@media(min-width: ${breakpoints[breakpoint]}px)`;
};

export const mediaBreakpointDown: (breakpoint: Breakpoints) => string = (breakpoint) => {
    return `@media(max-width: ${breakpoints[breakpoint] - 1}px)`;
};

export const vw: (value: number, screenWidth?: Breakpoints | number) => string = (value, screenWidth: Breakpoints | number = 1920) => {
    const widthInPx = typeof screenWidth === 'number' ? screenWidth : breakpoints[screenWidth];
    return `${(value / widthInPx) * 100}vw`;
};

export const vh: (value: number, screenHeight?: number) => string = (value, screenHeight = 1080) => {
    return `${(value / screenHeight) * 100}vh`;
};

export const color: (value: Colors, opacity?: number) => string = (value, opacity = 1) => {
    return rgba(colors[value], opacity);
};

export const cols: (value: number) => string = (value) => {
    return `${variables.col * value}vw`;
};

export const offset: (type: Offset) => string = (type) => {
    const size = {
        mobile: 375,
        tablet: 768,
        desktop: 1920
    };
    return vw(variables.offset[type], size[type]);
};

export const font: (name: Typography) => FlattenSimpleInterpolation = (name) => {
    return typography[name];
};

export const fontFamily: (name: FontFamily) => FlattenSimpleInterpolation = (name) => {
    return css`
        font-family: ${variables.fonts[name]};
    `;
};

export const hover = (styles: FlattenSimpleInterpolation): FlattenSimpleInterpolation => {
    return css`
        @media (hover: hover) {
            &:hover {
                ${styles}
            }
        }
    `;
};
