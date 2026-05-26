import React from 'react';
import { Person } from '@/lib/family/types';
import { formatLifespan, formatShortName } from '@/lib/family/relations';
import { NodeAvatar, NodeMeta, NodeName, NodeRelation, NodeWrapper } from './PersonNode.styled';

export interface PersonNodeProps {
    person: Person;
    x: number;
    y: number;
    width: number;
    height: number;
    relationLabel?: string;
    isHidden?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const PersonNode: React.FC<PersonNodeProps> = ({ person, x, y, width, height, relationLabel, isHidden, onClick }) => (
    <NodeWrapper
        type="button"
        $x={x}
        $y={y}
        $width={width}
        $height={height}
        $hidden={isHidden}
        onClick={onClick}
        onMouseDown={(e: any) => e.stopPropagation()}
        aria-label={formatShortName(person)}
    >
        <NodeAvatar $photo={person.photo} />
        <NodeRelation>{relationLabel ?? '—'}</NodeRelation>
        <NodeName>{formatShortName(person)}</NodeName>
        <NodeMeta>{formatLifespan(person)}</NodeMeta>
    </NodeWrapper>
);

export default PersonNode;