import styled, { css } from 'styled-components';
import { color, font, vw } from '@/style/mixins';
import { ModalCard, ModalVariant } from './Modal.styled';

export const SharedParentBlock = styled.fieldset`
    border: 1px solid ${color('mutedText', 0.35)};
    border-radius: ${vw(6, 'xs')};
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    display: flex;
    flex-direction: column;
    gap: ${vw(6, 'xs')};
`;

export const SharedParentLegend = styled.legend`
    ${font('mobileControl')};
    color: ${color('mutedText')};
    padding: 0 4px;
`;

export const SharedParentOption = styled.label`
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    ${font('mobileControl')};
    color: ${color('ink')};
    cursor: pointer;

    input {
        accent-color: ${color('forest')};
    }
`;

/**
 * Add/edit-person shell. Inherits the shared cream/cemetery theming from
 * ModalCard and re-themes this modal's shared-parent picker for the dark
 * cemetery variant.
 */
export const AddPersonCard = styled(ModalCard)<{ $variant?: ModalVariant }>`
    ${({ $variant }) =>
        $variant === 'cemetery' &&
        css`
            ${SharedParentBlock} {
                border-color: ${color('cream', 0.35)};
            }
            ${SharedParentLegend},
            ${SharedParentOption} {
                color: ${color('cream')};
            }
        `}
`;
