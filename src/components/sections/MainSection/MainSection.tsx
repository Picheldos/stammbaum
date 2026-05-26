import React from 'react';
import { useTranslation } from 'next-i18next';
import PersonCard from '@/components/blocks/PersonCard/PersonCard';
import type { PersonCardData } from '@/components/blocks/PersonCard/PersonCard';
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

const parseCards = (value: unknown): PersonCardData[] =>
    Array.isArray(value)
        ? (value as PersonCardData[]).filter((c) => c && typeof c.name === 'string')
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
                            <PersonCard data={c0} />
                        </CardTier>
                        <CardTier>
                            <PersonCard data={c1} />
                            <PersonCard data={c2} />
                        </CardTier>
                        <CardTier $compact>
                            <PersonCard data={c3} />
                            <PersonCard data={c4} />
                            <PersonCard data={c5} />
                            <PersonCard data={c6} />
                        </CardTier>
                    </CardsOverlay>
                    <TreeLayer>
                        <Image
                            src="/images/index/tree.jpg"
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
