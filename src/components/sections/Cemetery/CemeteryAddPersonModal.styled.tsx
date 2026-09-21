import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';
import {
    FieldLabel,
    FileInputRow,
    HeaderClose,
    Hint,
    Input,
    ModalCard,
    ModalHeader,
    Primary,
    Tab,
    Textarea
} from '../FamilyTree/Modal.styled';

/**
 * The cemetery ("virtual cemetery") keeps its dark museum-gray modal theme,
 * while the shared Modal.styled defaults to the warm cream tree theme. This
 * wrapper re-applies the dark palette to the whole cemetery modal, including
 * the bare shared fields (Input / Textarea / FieldLabel / FileInputRow /
 * Hint) rendered inside it, via descendant selectors so no per-field props
 * are needed.
 */
export const CemeteryModalCard = styled(ModalCard)`
    width: min(${vw(420, 'xs')}, 100%);
    background: ${color('cemeteryGray')};

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

    ${FieldLabel} {
        color: ${color('cream')};
        opacity: 0.8;
    }

    ${FileInputRow} {
        background: ${color('brown', 0.6)};
        border-color: ${color('cemeteryBorder', 0.6)};
        color: ${color('cream')};
    }

    ${Hint} {
        color: ${color('cream')};
    }
`;

export const CemeteryModalHeader = styled(ModalHeader)`
    background: ${color('cemeteryGray')};
    color: ${color('cream')};

    ${HeaderClose} {
        color: ${color('cream')};
    }
`;

export const CemeteryTab = styled(Tab)`
    color: ${({ $active }) => ($active ? color('cream') : color('cream'))};

    &:hover {
        color: ${color('cream')};
    }
`;

export const CemeteryPrimary = styled(Primary)`
    color: ${color('cream')};
`;

export const UploadRow = styled(FileInputRow)`
    ${font('mobileUpload')};
    color: ${color('cream')};
`;

export const AdditionalHint = styled(Hint)`
    ${font('mobileOptionalAction')};
    color: ${color('cream')};
`;
