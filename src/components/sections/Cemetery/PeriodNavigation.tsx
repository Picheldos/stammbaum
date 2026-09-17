import React from 'react';
import PeriodChip from './PeriodChip';
import type { CemeteryPeriod } from './Cemetery.types';
import { PeriodChipRow, PeriodNavRail } from './Cemetery.styled';

export interface PeriodNavigationProps {
    periods: CemeteryPeriod[];
    activeId: string | null;
    onPeriodClick: (id: string) => void;
}

const PeriodNavigation: React.FC<PeriodNavigationProps> = ({ periods, activeId, onPeriodClick }) => {
    return (
        <PeriodNavRail aria-label="periods" role="navigation">
            <PeriodChipRow>
                {periods.map((p) => (
                    <PeriodChip
                        key={p.id}
                        label={p.label}
                        active={p.id === activeId}
                        onClick={() => onPeriodClick(p.id)}
                    />
                ))}
            </PeriodChipRow>
        </PeriodNavRail>
    );
};

export default PeriodNavigation;
