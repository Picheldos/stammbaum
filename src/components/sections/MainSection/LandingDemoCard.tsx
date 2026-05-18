import React from 'react';
import {
    AvatarStub,
    DemoCardRoot,
    LifespanLine,
    MetaLine
} from '@/components/sections/MainSection/MainSection.styled';

export interface LandingDemoCardData {
    relation: string;
    name: string;
    lifespan: string;
}

export interface LandingDemoCardProps {
    data: LandingDemoCardData;
}

const LandingDemoCard: React.FC<LandingDemoCardProps> = ({ data }) => {
    return (
        <DemoCardRoot>
            <AvatarStub aria-hidden />
            <MetaLine>{data.relation}</MetaLine>
            <strong>{data.name}</strong>
            <LifespanLine>{data.lifespan}</LifespanLine>
        </DemoCardRoot>
    );
};

export default LandingDemoCard;
