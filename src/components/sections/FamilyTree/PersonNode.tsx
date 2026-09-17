import React from 'react';
import { Person } from '@/lib/family/types';
import { formatLifespan, formatShortName } from '@/lib/family/relations';
import {
    CemeteryNodeCard,
    CemeteryNodeMeta,
    CemeteryNodeName,
    CemeteryNodeRelation,
    NodeAvatar,
    NodeCard,
    NodeMeta,
    NodeName,
    NodeRelation,
    NodeWrapper
} from './PersonNode.styled';
import CemeteryAvatar from '../Cemetery/CemeteryAvatar';
import TimelineConnector from '../Cemetery/TimelineConnector';
import type { CemeteryPerson } from '../Cemetery/Cemetery.types';
 
export interface TreeNodeProps {
    /** Family-tree canvas variant (default). */
    variant?: 'tree';
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

export interface CemeteryTreeNodeProps {
    /** Cemetery memorial-card variant, chosen by the cemetery page. */
    variant: 'cemetery';
    person: CemeteryPerson;
    /** Vertical / horizontal branch used for collision avoidance (0 = first row). */
    row: number;
    /** Position along the timeline axis in px (left on desktop, top on mobile). */
    axisPos: number;
    isDesktop: boolean;
    /** Search-match highlight (mirrors the tree page search). */
    highlighted?: boolean;
    /** Geometry for the card→axis connector. */
    connector: { direction: 'vertical' | 'horizontal'; length: number };
}

export type PersonNodeProps = TreeNodeProps | CemeteryTreeNodeProps;
 
/**
 * Person card shared by the family-tree and virtual-cemetery canvases. The
 * page picks the rendering through the `variant` prop:
 *  - `tree` (default) — the canvas node. The visual design (layout, fonts,
 *    padding, dimensions) mirrors `PersonCard` exactly so that the canvas card
 *    looks identical at every breakpoint — in particular 105×50 at the xl
 *    breakpoint (≥ 1200px viewport).
 *  - `cemetery` — the memorial card on the timeline: gray card with cream
 *    text, circular avatar, relation, name, lifespan and a connector to the
 *    timeline axis. It is positioned absolutely next to the axis via
 *    `row`/`axisPos`.
 *
 * In the tree variant the wrapper still occupies the full `width × height`
 * slot at `(x, y)` so the connection lines computed in `layout.ts` against
 * those slot dimensions keep meeting the card. The visible card is
 * bottom-anchored inside the slot — that is what guarantees the user-visible
 * bottom edge stays at the same Y as before, even though the visible card is
 * now smaller than the slot.
 */
const PersonNode: React.FC<PersonNodeProps> = (props) => {
    if (props.variant === 'cemetery') {
        const { person, row, axisPos, isDesktop, highlighted, connector } = props;
        const label = formatShortName(person);
        return (
            <CemeteryNodeCard
                $row={row}
                $axisPos={axisPos}
                $isDesktop={isDesktop}
                $highlighted={highlighted}
                aria-label={label}
                role="figure"
            >
                <CemeteryAvatar person={person} />
                <CemeteryNodeRelation aria-label={person.relation}>
                    {person.relation}
                </CemeteryNodeRelation>
                <CemeteryNodeName title={label}>{label}</CemeteryNodeName>
                <CemeteryNodeMeta>{formatLifespan(person)}</CemeteryNodeMeta>
                <TimelineConnector {...connector} />
            </CemeteryNodeCard>
        );
    }

    const { person, x, y, width, height, relationLabel, isHidden, onClick } = props;
    return (
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
};
 
export default PersonNode;