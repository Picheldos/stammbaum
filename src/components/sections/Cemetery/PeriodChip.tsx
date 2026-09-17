import React from 'react';
import { PeriodChip as StyledChip } from './Cemetery.styled';

export interface PeriodChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}

/** A time-period segment matching the rounded vector path from the design. */
const PeriodChip: React.FC<PeriodChipProps> = ({ label, active, onClick }) => (
    <StyledChip type="button" $active={active} aria-pressed={active} onClick={onClick}>
        <svg viewBox="0 0 163 55" preserveAspectRatio="none" aria-hidden="true">
            <path
                vectorEffect="non-scaling-stroke"
                d="M5.44824 0.5H144.767C146.397 0.5 147.899 1.38179 148.694 2.80469L161.016 24.8486C161.766 26.1915 161.779 27.8246 161.049 29.1787L148.676 52.1348C147.891 53.5915 146.37 54.5 144.715 54.5H5.00684C1.63463 54.5 -0.539503 50.9279 1.00977 47.9326L10.9795 28.6572C11.84 26.9932 11.7944 25.0056 10.8584 23.3828L1.5498 7.24902C-0.126829 4.34286 1.85296 0.733654 5.12695 0.510742L5.44824 0.5Z"
            />
        </svg>
        <span>{label}</span>
    </StyledChip>
);

export default PeriodChip;
