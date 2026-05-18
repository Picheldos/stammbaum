import React from 'react';
import { ConnectionSegment } from '@/lib/family/layout';
import { ConnectionsSvg } from './FamilyTree.styled';

export interface ConnectionsProps {
    segments: ConnectionSegment[];
    bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

const PAD = 80;

const Connections: React.FC<ConnectionsProps> = ({ segments, bounds }) => {
    const width = bounds.maxX - bounds.minX + PAD * 2;
    const height = bounds.maxY - bounds.minY + PAD * 2;

    return (
        <ConnectionsSvg
            style={{ left: bounds.minX - PAD, top: bounds.minY - PAD, width, height }}
            viewBox={`${bounds.minX - PAD} ${bounds.minY - PAD} ${width} ${height}`}
        >
            {segments.map((seg) => {
                if (seg.kind === 'spouse') {
                    return (
                        <line
                            key={seg.id}
                            x1={seg.x1}
                            y1={seg.y1}
                            x2={seg.x2}
                            y2={seg.y2}
                            stroke="rgba(94, 109, 139, 0.7)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                        />
                    );
                }
                const midY = (seg.y1 + seg.y2) / 2;
                const d = `M${seg.x1} ${seg.y1} L${seg.x1} ${midY} L${seg.x2} ${midY} L${seg.x2} ${seg.y2}`;
                return <path key={seg.id} d={d} fill="none" stroke="rgba(74, 112, 67, 0.85)" strokeWidth={2} />;
            })}
        </ConnectionsSvg>
    );
};

export default Connections;
