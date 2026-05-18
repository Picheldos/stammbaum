import React from 'react';
import { useTranslation } from 'next-i18next';
import TreePlaceholder from '@/components/sections/MainSection/TreePlaceholder';
import LandingDemoCard from '@/components/sections/MainSection/LandingDemoCard';
import type { LandingDemoCardData } from '@/components/sections/MainSection/LandingDemoCard';
import Image from 'next/image';

import {
    CardTier,
    CardsOverlay,
    CtaButton,
    HeroContent,
    HeroGrid,
    HeroTitle,
    LandingRoot,
    StepCopy,
    StepIndex,
    StepItem,
    StepsList,
    TreeLayer,
    TreeScene
} from '@/components/sections/MainSection/MainSection.styled';

const parseCards = (value: unknown): LandingDemoCardData[] =>
    Array.isArray(value)
        ? (value as LandingDemoCardData[]).filter((c) => c && typeof c.name === 'string')
        : [];

const MainSection: React.FC = () => {
    const { t } = useTranslation('index');

    const cards = parseCards(t('cards', { returnObjects: true }));

    const [c0, c1, c2, c3, c4, c5, c6] = [
        cards[0],
        cards[1],
        cards[2],
        cards[3],
        cards[4],
        cards[5],
        cards[6]
    ].map((card) =>
        card ?? {
            relation: '—',
            name: '',
            lifespan: ''
        }
    );

    return (
        <LandingRoot>
            <HeroGrid>
                <HeroContent>
                    <HeroTitle>{t('hero.title')}</HeroTitle>
                    <StepsList>
                        {[1, 2, 3].map((n) => (
                            <StepItem key={n}>
                                <StepIndex>{n}/</StepIndex>
                                <StepCopy>{t(`hero.step${n}`)}</StepCopy>
                            </StepItem>
                        ))}
                    </StepsList>
                    <CtaButton type="button">{t('hero.cta')}</CtaButton>
                </HeroContent>

                <TreeScene>
                    <CardsOverlay>
                        <CardTier>
                            <LandingDemoCard data={c0} />
                        </CardTier>
                        <CardTier>
                            <LandingDemoCard data={c1} />
                            <LandingDemoCard data={c2} />
                        </CardTier>
                        <CardTier $compact>
                            <LandingDemoCard data={c3} />
                            <LandingDemoCard data={c4} />
                            <LandingDemoCard data={c5} />
                            <LandingDemoCard data={c6} />
                        </CardTier>
                    </CardsOverlay>
                    <TreeLayer>
                        <Image
                            src="/images/index/tree.png"
                            alt="decorative tree"
                            layout={'fill'}
                            objectFit={`cover`}
                            style={{ pointerEvents: 'none' }}
                            aria-hidden
                        />
                    </TreeLayer>
                </TreeScene>
            </HeroGrid>
        </LandingRoot>
    );
};

export default MainSection;
