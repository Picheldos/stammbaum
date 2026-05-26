import React from 'react';
import { Person } from '@/lib/family/types';
import { formatLifespan, formatShortName } from '@/lib/family/relations';
import {
    NodeAvatar,
    NodeCard,
    NodeMeta,
    NodeName,
    NodeRelation,
    NodeWrapper
} from './PersonNode.styled';
 
export interface PersonNodeProps {
    person: Person;
    /** Slot top-left X in canvas units. */
    x: number;
    /** Slot top-left Y in canvas units. */
    y: number;
    /** Slot width — also the value `layout.ts` uses to anchor connection X coords. */
    width: number;
    /** Slot height — also the value `layout.ts` uses to anchor connection Y coords. */
    height: number;
    relationLabel?: string;
    isHidden?: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
 
/**
 * In-tree person card. The visual design (layout, fonts, padding, dimensions)
 * mirrors `PersonCard` exactly so that the canvas card looks identical at every
 * breakpoint — in particular 105×50 at the xl breakpoint (≥ 1200px viewport).
 *
 * The wrapper still occupies the full `width × height` slot at `(x, y)` so the
 * connection lines computed in `layout.ts` against those slot dimensions keep
 * meeting the card. The visible card is bottom-anchored inside the slot — that
 * is what guarantees the user-visible bottom edge stays at the same Y as
 * before, even though the visible card is now smaller than the slot.
 */
const PersonNode: React.FC<PersonNodeProps> = ({
    person,
    x,
    y,
    width,
    height,
    relationLabel,
    isHidden,
    onClick
}) => (
    <NodeWrapper $x={x} $y={y} $width={width} $height={height}>
        <NodeCard
            type="button"
            $hidden={isHidden}
            onClick={onClick}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label={formatShortName(person)}
        >
            <NodeAvatar $photo={person.photo} aria-hidden />
            <NodeRelation>{relationLabel ?? '—'}</NodeRelation>
            <NodeName>{formatShortName(person)}</NodeName>
            <NodeMeta>{formatLifespan(person)}</NodeMeta>
        </NodeCard>
    </NodeWrapper>
);
 
export default PersonNode;