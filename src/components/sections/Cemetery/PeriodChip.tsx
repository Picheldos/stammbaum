import React from 'react';
import { PeriodChip as StyledChip } from './Cemetery.styled';

export interface PeriodChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}

/**
 * A single time-period "pill" with the characteristic slanted/arrow sides
 * (reproduced via CSS `clip-path`, not a plain rounded rectangle).
 */
const PeriodChip: React.FC<PeriodChipProps> = ({ label, active, onClick }) => (
    <StyledChip type="button" $active={active} aria-pressed={active} onClick={onClick}>
        {label}
    </StyledChip>
);

export default PeriodChip;
