import React from 'react';
import {
    CemeteryPersonCard as Card,
    CardRelation,
    CardDate,
    CardName
} from './Cemetery.styled';
import CemeteryAvatar from './CemeteryAvatar';
import TimelineConnector from './TimelineConnector';
import { formatPersonName, formatLifespan } from './cemeteryUtils';
import type { CemeteryPerson } from './Cemetery.types';

export interface CemeteryPersonCardProps {
    person: CemeteryPerson;
    $row: number;
    $axisPos: number;
    $isDesktop: boolean;
    /** Geometry for the card→axis connector. */
    connector: { direction: 'vertical' | 'horizontal'; length: number };
}

/**
 * Data-driven memorial card: circular avatar, relation, name and lifespan.
 * Layout is driven by props so the same component is reused for every
 * relative — no per-person markup rules.
 */
const CemeteryPersonCard: React.FC<CemeteryPersonCardProps> = ({
    person,
    $row,
    $axisPos,
    $isDesktop,
    connector
}) => {
    const label = `${person.lastName} ${person.firstName}`;

    return (
        <Card $row={$row} $axisPos={$axisPos} $isDesktop={$isDesktop} aria-label={label} role="figure">
            <CemeteryAvatar person={person} />
            <CardRelation aria-label={person.relation}>{person.relation}</CardRelation>
            <CardName title={label}>{formatPersonName(person)}</CardName>
            <CardDate>{formatLifespan(person)}</CardDate>
            <TimelineConnector {...connector} />
        </Card>
    );
};

export default CemeteryPersonCard;
