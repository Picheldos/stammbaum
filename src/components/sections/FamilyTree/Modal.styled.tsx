import styled, { css } from 'styled-components';
import { color, font, hover, mediaBreakpointUp, vw } from '@/style/mixins';

export const Overlay = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 900;
    background: ${color('black', 0.25)};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${vw(16, 'xs')};
    overscroll-behavior: contain;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.2s ease;
`;

export type ModalVariant = 'tree' | 'cemetery';

/**
 * Shared modal shell. Defaults to the warm cream "tree" theme that matches the
 * Figma popups (`#F8EACF` body, `#64774A` header, white fields, dark text).
 * The virtual-cemetery keeps its dark museum-gray theme — pass
 * `$variant="cemetery"` and every shared child below re-themes via descendant
 * selectors (deferred to render time so it doesn't matter that those styled
 * components are declared later in this file).
 */
export const ModalCard = styled.div<{ $variant?: ModalVariant }>`
    width: min(${vw(420, 'xs')}, 100%);
    max-height: calc(100vh - 32px);
    overflow: auto;
    background: ${color('popupBackground')};
    border-radius: ${vw(8, 'xs')};
    box-shadow: 0 ${vw(20, 'xs')} ${vw(48, 'xs')} ${color('brown', 0.32)};
    display: flex;
    flex-direction: column;

    ${mediaBreakpointUp('lg')} {
        width: min(${vw(420)}, 100%);
        border-radius: ${vw(8)};
        box-shadow: 0 ${vw(20)} ${vw(48)} ${color('brown', 0.32)};
    }

    ${({ $variant }) =>
        $variant === 'cemetery' &&
        css`
            background: ${color('cemeteryGray')};

            ${ModalHeader} {
                background: ${color('cemeteryGray')};
                color: ${color('cream')};
            }
            ${HeaderClose} {
                color: ${color('cream')};
            }
            ${Tab} {
                color: ${color('cream')};
                &:hover {
                    color: ${color('cream')};
                }
            }
            ${ToggleButton} {
                color: ${color('cream')};
                border-color: ${color('cream', 0.4)};
            }
            ${FieldLabel},
            ${InfoLabel} {
                color: ${color('cream')};
                opacity: 0.75;
            }
            ${InfoValue} {
                color: ${color('cream')};
            }
            ${Input},
            ${Textarea} {
                background: ${color('brown', 0.6)};
                border-color: ${color('cemeteryBorder', 0.6)};
                color: ${color('cream')};
                &::placeholder {
                    color: ${color('cream', 0.5)};
                    opacity: 1;
                }
                &:focus {
                    outline-color: ${color('cream')};
                }
            }
            ${FileInputRow} {
                background: ${color('brown', 0.6)};
                border-color: ${color('cemeteryBorder', 0.6)};
                color: ${color('cream')};
            }
            ${Hint} {
                color: ${color('cream')};
            }
        `}
`;

export const ModalHeader = styled.div`
    background: ${color('forest')};
    color: ${color('cream')};
    padding: ${vw(12, 'xs')} ${vw(16, 'xs')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${font('mobileHeader')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(12)} ${vw(16)};
    }
`;

export const HeaderClose = styled.button`
    background: transparent;
    border: none;
    color: ${color('cream')};
    cursor: pointer;
    ${font('bodyLarge')};

    &:focus-visible {
        outline: 2px solid ${color('cream')};
        outline-offset: 2px;
    }
`;

export const ModalBody = styled.div`
    padding: ${vw(16, 'xs')} ${vw(18, 'xs')} ${vw(20, 'xs')};
    display: flex;
    flex-direction: column;
    gap: ${vw(12, 'xs')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(16)} ${vw(18)} ${vw(20)};
        gap: ${vw(12)};
    }
`;

export const Tabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${vw(6, 'xs')} ${vw(12, 'xs')};
    ${font('mobileControl')};
    margin-bottom: 4px;

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(6)} ${vw(12)};
    }
`;

export const Tab = styled.button<{ $active?: boolean }>`
    background: ${({ $active }) => ($active ? color('landingCta') : 'transparent')};
    color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
    border: none;
    border-radius: 4px;
    padding: 4px ${vw(10, 'xs')};
    cursor: pointer;
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: 4px ${vw(10)};
    }

    &:hover {
        background: ${({ $active }) => ($active ? color('landingCta') : color('landingCta', 0.12))};
        color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
    }
`;

export const GenderToggle = styled.div`
    display: flex;
    gap: ${vw(6, 'xs')};

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(6)};
    }
`;

export const ToggleButton = styled.button<{ $active?: boolean }>`
    background: ${({ $active }) => ($active ? color('landingCta') : 'transparent')};
    color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
    border: 1px solid ${({ $active }) => ($active ? 'transparent' : color('mutedText', 0.5))};
    border-radius: 4px;
    padding: 4px ${vw(14, 'xs')};
    cursor: pointer;
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: 4px ${vw(14)};
    }
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const FieldLabel = styled.label`
    ${font('mobileControl')};
    color: ${color('mutedText')};
`;

export const Input = styled.input`
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    border-radius: ${vw(6, 'xs')};
    border: 1px solid ${color('mutedText', 0.35)};
    background: ${color('white')};
    color: ${color('ink')};
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(12)};
        border-radius: ${vw(6)};
    }

    &::placeholder {
        color: ${color('mutedText', 0.75)};
    }

    &:focus {
        outline: 2px solid ${color('landingCta')};
        outline-offset: -2px;
    }
`;

export const Textarea = styled.textarea`
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    border-radius: ${vw(6, 'xs')};
    border: 1px solid ${color('mutedText', 0.35)};
    background: ${color('white')};
    color: ${color('ink')};
    ${font('mobileControl')};
    min-height: ${vw(80, 'xs')};
    resize: vertical;

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(12)};
        border-radius: ${vw(6)};
        min-height: ${vw(80)};
    }

    &::placeholder {
        color: ${color('mutedText', 0.75)};
    }

    &:focus {
        outline: 2px solid ${color('landingCta')};
        outline-offset: -2px;
    }
`;

export const FileInputRow = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    background: ${color('white')};
    border-radius: ${vw(6, 'xs')};
    border: 1px solid ${color('mutedText', 0.35)};
    color: ${color('mutedText')};
    ${font('mobileControl')};
    cursor: pointer;

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(12)};
        border-radius: ${vw(6)};
    }

    input[type='file'] {
        display: none;
    }
`;

export const Hint = styled.button`
    background: transparent;
    border: none;
    padding: 0;
    color: ${color('mutedText')};
    opacity: 0.9;
    text-decoration: underline;
    cursor: pointer;
    ${font('mobileMicroLink')};
    text-align: left;
`;

export const Hints = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${vw(6, 'xs')};

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(6)};
    }
`;

export const Primary = styled.button`
    background: ${color('landingCta')};
    color: ${color('cream')};
    border: none;
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(12, 'xs')} ${vw(16, 'xs')};
    cursor: pointer;
    ${font('mobileAction')};

    ${mediaBreakpointUp('lg')} {
        border-radius: ${vw(8)};
        padding: ${vw(12)} ${vw(16)};
    }

    ${hover(css`
        background: ${color('slateBlue')};
    `)}
`;

export const ErrorText = styled.div`
    color: ${color('error')};
    ${font('error')};
`;

export const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${vw(8, 'xs')};

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(8)};
    }
`;

export const InfoLabel = styled.span`
    ${font('mobileControl')};
    color: ${color('mutedText')};
`;

export const InfoValue = styled.span`
    ${font('mobileHeader')};
    color: ${color('ink')};
`;
