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
        font-family: var(--font-inter), ${variables.fonts.helvetica};
        scrollbar-gutter: stable;
        color: ${color('textPrimary')};
    }

    body {
        padding: 0;
        margin: 0;
        overscroll-behavior: none;
        overflow: auto;
    }

    input {
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
        font-family: var(--font-inter), ${variables.fonts.helvetica};
        border: none;

        &, &:active,
        &:focus {
            outline: none;
        }
    }
`;

export default GlobalStyle;
