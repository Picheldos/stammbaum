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

export const ModalCard = styled.div`
    width: min(${vw(420, 'xs')}, 100%);
    max-height: calc(100vh - 32px);
    overflow: auto;
    background: ${color('landingCard')};
    border-radius: ${vw(8, 'xs')};
    box-shadow: 0 ${vw(20, 'xs')} ${vw(48, 'xs')} ${color('brown', 0.32)};
    display: flex;
    flex-direction: column;

    ${mediaBreakpointUp('lg')} {
        width: min(${vw(420)}, 100%);
        border-radius: ${vw(8)};
        box-shadow: 0 ${vw(20)} ${vw(48)} ${color('brown', 0.32)};
    }
`;

export const ModalHeader = styled.div`
    background: ${color('forest')};
    color: ${color('white')};
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
    color: ${color('white')};
    cursor: pointer;
    ${font('bodyLarge')};

    &:focus-visible {
        outline: 2px solid ${color('white')};
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
    color: ${({ $active }) => ($active ? color('white') : color('textPrimary'))};
    border: none;
    border-radius: 4px;
    padding: 4px ${vw(10, 'xs')};
    cursor: pointer;
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: 4px ${vw(10)};
    }

    ${hover(css`
        background: ${color('slateShadow', 0.18)};
        color: ${color('textPrimary')};
    `)}
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
    color: ${({ $active }) => ($active ? color('white') : color('textPrimary'))};
    border: 1px solid ${({ $active }) => ($active ? 'transparent' : color('slateShadow', 0.5))};
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
    border: 1px solid ${color('white', 0.6)};
    background: ${color('white')};
    color: ${color('textPrimary')};
    ${font('mobileControl')};

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(12)};
        border-radius: ${vw(6)};
    }

    &::placeholder {
        color: ${color('darkGray')};
    }

    &:focus {
        outline: 2px solid ${color('forest')};
        outline-offset: -2px;
    }
`;

export const Textarea = styled.textarea`
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    border-radius: ${vw(6, 'xs')};
    border: 1px solid ${color('white', 0.6)};
    background: ${color('white')};
    color: ${color('textPrimary')};
    ${font('mobileControl')};
    min-height: ${vw(80, 'xs')};
    resize: vertical;

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(10)} ${vw(12)};
        border-radius: ${vw(6)};
        min-height: ${vw(80)};
    }

    &:focus {
        outline: 2px solid ${color('forest')};
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
    border: 1px solid ${color('white', 0.6)};
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
    color: ${color('white')};
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
    color: ${color('textPrimary')};
`;
