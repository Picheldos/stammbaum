import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { SizesState } from '@/recoil/commonState/athom';
import useParallax from '@/hooks/useParallax';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

import {
    CtaButton,
    HeroContent,
    HeroGrid,
    HeroTitle,
    LandingRoot,
    StepCopy,
    StepIndex,
    StepItem,
    StepsList,
    TreeLayer
} from '@/components/sections/MainSection/MainSection.styled';

const STEP_INDEX_WEIGHTS = [800, 500, 700] as const;

const MainSection: React.FC = () => {
    const { t } = useTranslation('index');
    const router = useRouter();
    const { isMobile } = useRecoilValue(SizesState);
    const heroTitleRef = useRevealOnScroll<HTMLHeadingElement>();
    const treeRef = useRef<HTMLDivElement>(null);

    // Параллакс дерева: слой дрейфует вверх при скролле, создавая глубину.
    // На мобильных отключён — там дерево маленькое и макет другой.
    useParallax(treeRef, { from: 60, to: -60, disabled: isMobile });

    return (
        <LandingRoot>
            <HeroGrid>
                <HeroContent>
                    <HeroTitle ref={heroTitleRef}>{t('hero.title')}</HeroTitle>
                    <StepsList>
                        {STEP_INDEX_WEIGHTS.map((weight, index) => {
                            const step = index + 1;
                            return (
                                <StepItem key={step}>
                                    <StepIndex $weight={weight}>{step}/</StepIndex>
                                    <StepCopy>{t(`hero.step${step}`)}</StepCopy>
                                </StepItem>
                            );
                        })}
                    </StepsList>
                    <CtaButton type="button" onClick={() => router.push('/tree')}>{t('hero.cta')}</CtaButton>
                </HeroContent>

                <TreeLayer ref={treeRef}>
                    <Image
                        src={isMobile ? '/images/index/tree-m.png' : '/images/index/tree.png'}
                        alt="decorative tree"
                        fill
                        sizes={isMobile ? '100vw' : '47vw'}
                        loading="eager"
                        aria-hidden
                    />
                </TreeLayer>
                {isMobile && <CtaButton type="button" onClick={() => router.push('/tree')}>{t('hero.cta')}</CtaButton>}
            </HeroGrid>
        </LandingRoot>
    );
};

export default MainSection;
