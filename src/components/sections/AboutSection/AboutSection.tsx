import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { AboutBlock } from '@/components/blocks/AboutBlock/AboutBlock';
import { Popup } from '@/components/common/Popup/Popup';

import { Container, FlexContainer } from './AboutSection.styled';

const STEP_CONFIG = [
  { stepNumber: 1, color: '#576686' },
  { stepNumber: 2, color: '#64774A' },
  { stepNumber: 3, color: '#64774A' },
  { stepNumber: 4, color: '#576686' },
] as const;

type StepTranslation = {
  title: string;
  content: string;
};

const parseSteps = (value: unknown): StepTranslation[] =>
  Array.isArray(value)
    ? (value as StepTranslation[]).filter((step) => step && typeof step.title === 'string')
    : [];

export const AboutSection: React.FC = () => {
  const { t } = useTranslation('about');
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = useMemo(() => {
    const translations = parseSteps(t('steps', { returnObjects: true }));

    return STEP_CONFIG.map((config, index) => ({
      ...config,
      title: translations[index]?.title ?? '',
      content: translations[index]?.content ?? '',
    }));
  }, [t]);

  const activeStepData = steps.find((step) => step.stepNumber === activeStep);
  const totalSteps = steps.length;

  return (
    <Container>
      <h1>{t('title')}</h1>

      <FlexContainer>
        <AboutBlock
          color={steps[0].color}
          variant="step"
          stepNumber={steps[0].stepNumber}
          title={steps[0].title}
          popupContent={steps[0].content}
          onPopupOpen={() => setActiveStep(steps[0].stepNumber)}
        />

        <AboutBlock variant="image" image={'/images/about/family.jpg'} />

        <AboutBlock variant="empty" />

        <AboutBlock
          color={steps[1].color}
          variant="step"
          stepNumber={steps[1].stepNumber}
          title={steps[1].title}
          popupContent={steps[1].content}
          onPopupOpen={() => setActiveStep(steps[1].stepNumber)}
        />

        <AboutBlock
          color={steps[2].color}
          variant="step"
          stepNumber={steps[2].stepNumber}
          title={steps[2].title}
          popupContent={steps[2].content}
          onPopupOpen={() => setActiveStep(steps[2].stepNumber)}
        />

        <AboutBlock variant="empty" />

        <AboutBlock variant="text" title={t('description')} />

        <AboutBlock
          color={steps[3].color}
          variant="step"
          stepNumber={steps[3].stepNumber}
          title={steps[3].title}
          popupContent={steps[3].content}
          onPopupOpen={() => setActiveStep(steps[3].stepNumber)}
        />
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
