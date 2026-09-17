import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';
import {
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

export const CemeteryModalCard = styled(ModalCard)`
    width: min(${vw(420, 'xs')}, 100%);

    ${Input}::placeholder,
    ${Textarea}::placeholder {
        color: ${color('mutedText')};
        opacity: 1;
    }
`;

export const CemeteryModalHeader = styled(ModalHeader)`
    color: ${color('cream')};

    ${HeaderClose} {
        color: ${color('cream')};
    }
`;

export const CemeteryTab = styled(Tab)`
    color: ${({ $active }) => ($active ? color('cream') : color('ink'))};

    &:hover {
        color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
    }
`;

export const CemeteryPrimary = styled(Primary)`
    color: ${color('cream')};
`;

export const UploadRow = styled(FileInputRow)`
    ${font('mobileUpload')};
    color: ${color('mutedText')};
`;

export const AdditionalHint = styled(Hint)`
    ${font('mobileOptionalAction')};
    color: ${color('ink')};
`;
