import styled, { css } from 'styled-components';
import { color, mediaBreakpointDown } from '@/style/mixins';

const PAINT = color('forest');
const PAINT_FAINT = color('forest', 0.3);
const PAPER = color('cream');
const STROKE_WIDTH = '1.25px';
/** Ширина мягкого фронта заливки (в % от надписи) */
const FEATHER = '7%';

export const Overlay = styled.div<{ $hidden: boolean }>`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${PAPER};
    z-index: 9999;
    opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
    visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
    pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
    transition: opacity 0.6s ease, visibility 0.6s ease;
`;

/** Тот же шрифт, что у логотипа-wordmark в Header (Playfair Display), но крупнее под прелоадер. */
export const Wordmark = styled.span`
    font-family: var(--font-playfair-display), 'Playfair Display', Georgia, serif;
    font-weight: 500;
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
    font-size: 56px;

    ${mediaBreakpointDown('lg')} {
        font-size: 44px;
    }

    ${mediaBreakpointDown('sm')} {
        font-size: 32px;
    }
`;

/** Обе копии надписи лежат в одной grid-ячейке и совпадают попиксельно. */
export const LogoStack = styled.div`
    --fill: 100%;
    display: grid;
    place-items: center;
`;

export const Layer = styled.div<{ $variant: 'outline' | 'fill' }>`
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    color: ${PAINT};

    ${Wordmark} {
        paint-order: stroke fill;
    }

    ${({ $variant }) =>
        $variant === 'outline'
            ? css`
                  ${Wordmark} {
                      color: transparent;
                      -webkit-text-stroke: ${STROKE_WIDTH} ${PAINT_FAINT};
                  }
              `
            : css`
                  /* Красочная копия «растекается» слева направо с мягким фронтом. */
                  --edge: calc(100% - var(--fill));
                  -webkit-mask-image: linear-gradient(
                      to right,
                      #000 0%,
                      #000 calc(var(--edge) - ${FEATHER}),
                      transparent calc(var(--edge) + ${FEATHER}),
                      transparent 100%
                  );
                  mask-image: linear-gradient(
                      to right,
                      #000 0%,
                      #000 calc(var(--edge) - ${FEATHER}),
                      transparent calc(var(--edge) + ${FEATHER}),
                      transparent 100%
                  );

                  ${Wordmark} {
                      color: ${PAINT};
                      -webkit-text-stroke: ${STROKE_WIDTH} ${PAINT};
                  }
              `}
`;
