import { AboutBlock } from '@/components/blocks/AboutBlock/AboutBlock';
import { Popup } from '@/components/common/Popup/Popup';
import { SizesState } from '@/recoil/commonState/athom';
import colors from '@/style/colors';
import { useTranslation } from 'next-i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Container, FlexContainer } from './AboutSection.styled';

type StepConfig = {
    stepNumber: number;
    /** Цвет фона блока на десктопе (макет Group 103) */
    color: string;
    /** Только для мобильного макета (Group 104): блок рисуется белым, а текст и иконка — этим цветом */
    mobileTextColor?: string;
};

type StepTranslation = {
    title: string;
    content: string;
};

type Step = StepConfig & StepTranslation;

/**
 * Десктоп (макет Group 103): шаги 2 и 3 идут на зелёном фоне (colors.forest), шаги 1 и 4 — на синем (colors.landingCta).
 * Мобильный макет (Group 104): третий шаг без заливки — белая карточка с обводкой и тёмным текстом.
 */
const STEP_CONFIG: readonly StepConfig[] = [
    { stepNumber: 1, color: colors.landingCta },
    { stepNumber: 2, color: colors.forest },
    { stepNumber: 3, color: colors.forest, mobileTextColor: colors.ink },
    { stepNumber: 4, color: colors.landingCta }
];

const parseSteps = (value: unknown): StepTranslation[] =>
    Array.isArray(value) ? (value as StepTranslation[]).filter((step) => step && typeof step.title === 'string') : [];

const AboutSection: React.FC = () => {
    const { t } = useTranslation('about');
    const { isMobile } = useRecoilValue(SizesState);
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const steps = useMemo(() => {
        const translations = parseSteps(t('steps', { returnObjects: true }));

        return STEP_CONFIG.map((config, index) => ({
            ...config,
            title: translations[index]?.title ?? '',
            content: translations[index]?.content ?? ''
        }));
    }, [t]);

    const activeStepData = steps.find((step) => step.stepNumber === activeStep);
    const totalSteps = steps.length;
    const handlePopupClose = useCallback(() => setActiveStep(null), []);
    const handleStepChange = useCallback((step: number) => setActiveStep(step), []);

    const renderStepBlock = (step: Step) => (
        <AboutBlock
            color={step.color}
            textColor={isMobile ? step.mobileTextColor : undefined}
            variant="step"
            stepNumber={step.stepNumber}
            title={step.title}
            onPopupOpen={() => setActiveStep(step.stepNumber)}
        />
    );

    return (
        <Container>
            <h1>{t('title')}</h1>

            <FlexContainer>
                {isMobile ? (
                    <>
                        <AboutBlock variant="text" title={t('description')} />
                        {steps.map((step) => (
                            <React.Fragment key={step.stepNumber}>{renderStepBlock(step)}</React.Fragment>
                        ))}
                    </>
                ) : (
                    <>
                        {renderStepBlock(steps[0])}

                        <AboutBlock variant="image" image={'/images/about/family.jpg'} />

                        <AboutBlock variant="empty" />

                        {renderStepBlock(steps[1])}
                        {renderStepBlock(steps[2])}

                        <AboutBlock variant="empty" />

                        <AboutBlock variant="text" title={t('description')} />

                        {renderStepBlock(steps[3])}
                    </>
                )}
            </FlexContainer>

            {activeStep !== null && activeStepData && (
                <Popup
                    isOpen
                    onClose={handlePopupClose}
                    title={t('popupStep', { number: activeStepData.stepNumber })}
                    subtitle={activeStepData.title}
                    content={activeStepData.content}
                    currentStep={activeStepData.stepNumber}
                    totalSteps={totalSteps}
                    onStepChange={handleStepChange}
                />
            )}
        </Container>
    );
};

export default AboutSection;