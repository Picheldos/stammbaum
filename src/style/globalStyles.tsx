import { createGlobalStyle } from 'styled-components';
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
        font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
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
    }

    button {
        font-family: inherit;
        border: none;
    }

    :where(a, button, input, select, textarea):focus-visible {
        outline: 3px solid ${color('forest')};
        outline-offset: 3px;
    }
`;

export default GlobalStyle;
