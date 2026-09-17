import React from 'react';
import { AddRelativeButton as StyledBtn } from './Cemetery.styled';

export interface AddRelativeButtonProps {
    text: string;
    onClick?: () => void;
}

/**
 * Primary call-to-action button. Text and action come from props so the same
 * component serves the FHD "Add Information" and the 1200 "Add relative" labels.
 */
const AddRelativeButton: React.FC<AddRelativeButtonProps> = ({ text, onClick }) => (
    <StyledBtn type="button" onClick={onClick}>
        {text}
    </StyledBtn>
);

export default AddRelativeButton;
