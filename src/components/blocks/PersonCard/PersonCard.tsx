import React from 'react';
import { Person } from '@/lib/family/types';
import { formatLifespan, formatShortName } from '@/lib/family/relations';
import {
    AvatarStub,
    Container,
    LifespanLine,
    MetaLine
} from './PersonCard.styled';

export interface PersonCardData {
    relation: string;
    name: string;
    lifespan: string;
}

export interface PersonCardProps {
    data?: PersonCardData;
    person?: Person;
    relationLabel?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    isHidden?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
    ariaLabel?: string;
    xlWidth?: number;
    xlHeight?: number;
}

const PersonCard: React.FC<PersonCardProps> = ({
    data,
    person,
    relationLabel,
    x,
    y,
    width,
    height,
    isHidden,
    onClick,
    onMouseDown,
    ariaLabel,
    xlWidth,
    xlHeight
}) => {
    const isPositioned = x !== undefined && y !== undefined;
    const displayData = data || (person ? {
        relation: relationLabel ?? '—',
        name: formatShortName(person),
        lifespan: formatLifespan(person)
    } : null);

    if (!displayData) return null;

    return (
        <Container
            $x={x}
            $y={y}
            $width={width}
            $height={height}
            $xlWidth={xlWidth}
            $xlHeight={xlHeight}
            $isPositioned={isPositioned}
            $hidden={isHidden}
            onClick={onClick}
            onMouseDown={onMouseDown}
            role={isPositioned ? 'button' : 'region'}
            aria-label={ariaLabel}
        >
            <AvatarStub $photo={person?.photo} aria-hidden />
            <MetaLine>{displayData.relation}</MetaLine>
            <span>{displayData.name}</span>
            <LifespanLine>{displayData.lifespan}</LifespanLine>
        </Container>
    );
};

export default PersonCard;
