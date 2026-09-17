import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const SharedParentBlock = styled.fieldset`
    border: 1px solid ${color('slateShadow', 0.35)};
    border-radius: ${vw(6, 'xs')};
    padding: ${vw(10, 'xs')} ${vw(12, 'xs')};
    display: flex;
    flex-direction: column;
    gap: ${vw(6, 'xs')};
`;

export const SharedParentLegend = styled.legend`
    ${font('mobileControl')};
    color: ${color('textPrimary')};
    opacity: 0.75;
    padding: 0 4px;
`;

export const SharedParentOption = styled.label`
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    ${font('mobileControl')};
    color: ${color('textPrimary')};
    cursor: pointer;

    input {
        accent-color: ${color('forest')};
    }
`;
