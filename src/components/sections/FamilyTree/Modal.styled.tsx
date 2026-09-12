import styled, { css } from 'styled-components';
import { color, font, hover } from '@/style/mixins';

export const Overlay = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 900;
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    overscroll-behavior: contain;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.2s ease;
`;

export const ModalCard = styled.div`
    width: min(420px, 100%);
    max-height: calc(100vh - 32px);
    overflow: auto;
    background: ${color('landingCard')};
    border-radius: 8px;
    box-shadow: 0 20px 48px rgba(35, 24, 24, 0.32);
    display: flex;
    flex-direction: column;
`;

export const ModalHeader = styled.div`
    background: ${color('forest')};
    color: ${color('white')};
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${font('mobileHeader')};
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
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Tabs = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    ${font('mobileControl')};
    margin-bottom: 4px;
`;

export const Tab = styled.button<{ $active?: boolean }>`
    background: ${({ $active }) => ($active ? color('landingCta') : 'transparent')};
    color: ${({ $active }) => ($active ? color('white') : color('textPrimary'))};
    border: none;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    ${font('mobileControl')};

    ${hover(css`
        background: rgba(94, 109, 139, 0.18);
        color: ${color('textPrimary')};
    `)}
`;

export const GenderToggle = styled.div`
    display: flex;
    gap: 6px;
`;

export const ToggleButton = styled.button<{ $active?: boolean }>`
    background: ${({ $active }) => ($active ? color('landingCta') : 'transparent')};
    color: ${({ $active }) => ($active ? color('white') : color('textPrimary'))};
    border: 1px solid ${({ $active }) => ($active ? 'transparent' : 'rgba(94,109,139,0.5)')};
    border-radius: 4px;
    padding: 4px 14px;
    cursor: pointer;
    ${font('mobileControl')};
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const FieldLabel = styled.label`
    ${font('mobileControl')};
    color: #5d5d5d;
`;

export const Input = styled.input`
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: ${color('white')};
    color: ${color('textPrimary')};
    ${font('mobileControl')};

    &::placeholder {
        color: ${color('darkGray')};
    }

    &:focus {
        outline: 2px solid ${color('forest')};
        outline-offset: -2px;
    }
`;

export const Textarea = styled.textarea`
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: ${color('white')};
    color: ${color('textPrimary')};
    ${font('mobileControl')};
    min-height: 80px;
    resize: vertical;

    &:focus {
        outline: 2px solid ${color('forest')};
        outline-offset: -2px;
    }
`;

export const FileInputRow = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: ${color('white')};
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    ${font('mobileControl')};
    cursor: pointer;

    input[type='file'] {
        display: none;
    }
`;

export const Hint = styled.button`
    background: transparent;
    border: none;
    padding: 0;
    color: #5d5d5d;
    text-decoration: underline;
    cursor: pointer;
    ${font('mobileMicroLink')};
    text-align: left;
`;

export const Hints = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const Primary = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: 8px;
    padding: 12px 16px;
    cursor: pointer;
    ${font('mobileAction')};

    ${hover(css`
        background: ${color('slateBlue')};
    `)}
`;

export const ErrorText = styled.div`
    color: #8b2b2b;
    ${font('error')};
`;

export const InfoBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const InfoLabel = styled.span`
    ${font('mobileControl')};
    color: #5d5d5d;
`;

export const InfoValue = styled.span`
    ${font('mobileHeader')};
    color: ${color('textPrimary')};
`;
