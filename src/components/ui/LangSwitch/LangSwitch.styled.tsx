import styled, { css } from 'styled-components';
import { color, font, hover } from '@/style/mixins';

export const Container = styled.div<{ $light?: boolean; $compact?: boolean }>`
    cursor: pointer;
    ${({ $compact }) => font($compact ? 'font7' : 'logo')};
    padding: 4px 6px;
    font-weight: ${({ $compact }) => ($compact ? 600 : 400)};

    ${({ $light }) =>
        $light &&
        css`
            color: ${color('white')};
        `}

    ${hover(css`
        cursor: pointer;
        opacity: 0.88;
    `)}
`;
