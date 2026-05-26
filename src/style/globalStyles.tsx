import { createGlobalStyle } from 'styled-components';
import variables from './variables';
import { color } from './mixins';

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    ::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }

    html {
        /* Основной шрифт — Manrope через CSS-переменную set в _app.tsx */
        font-family: var(--font-manrope), ${variables.fonts.proxima};
        scrollbar-gutter: stable;
        color: ${color('textPrimary')};
    }

    body {
        padding: 0;
        margin: 0;
        overscroll-behavior: none;
        overflow: auto;
    }

    input[type="checkbox"] {
        -webkit-appearance: auto;
        appearance: auto;
        width: 16px;
        height: 16px;
        margin: 0;
    }

    input:not([type="checkbox"]) {
        -webkit-appearance: none;
        outline: none;
    }

    h1, h2, h3, h4, h5, span, a {
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        text-transform: inherit;
        text-decoration: inherit;
        margin: 0;
    }

    a {
        text-decoration: none;
        color: inherit;
        outline: none;
    }

    button {
        font-family: var(--font-manrope), ${variables.fonts.proxima};
        border: none;

        &, &:active,
        &:focus {
            outline: none;
        }
    }
`;

export default GlobalStyle;
