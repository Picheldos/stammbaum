import { AboutBlock } from '@/components/blocks/AboutBlock/AboutBlock';
import { Popup } from '@/components/common/Popup/Popup';
import { SizesState } from '@/recoil/commonState/athom';
import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Container, FlexContainer } from './AboutSection.styled';

const STEP_CONFIG = [
    { stepNumber: 1, color: '#576686' },
    { stepNumber: 2, color: '#64774A' },
    { stepNumber: 3, color: '#64774A' },
    { stepNumber: 4, color: '#576686' }
] as const;

type StepTranslation = {
    title: string;
    content: string;
};

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

    const renderStepBlock = (step: (typeof STEP_CONFIG)[number] & { title: string; content: string }) => (
        <AboutBlock
            color={step.color}
            variant="step"
            stepNumber={step.stepNumber}
            title={step.title}
            popupContent={step.content}
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
                    isOpen={activeStep !== null}
                    onClose={() => setActiveStep(null)}
                    title={t('popupStep', { number: activeStepData.stepNumber })}
                    subtitle={activeStepData.title}
                    content={activeStepData.content}
                    currentStep={activeStepData.stepNumber}
                    totalSteps={totalSteps}
                    onStepChange={setActiveStep}
                />
            )}
        </Container>
    );
};

export default AboutSection;