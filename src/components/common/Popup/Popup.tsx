import React, { useEffect } from 'react';
import {
  Overlay,
  Content,
  Header,
  Title,
  CloseButton,
  PrevButton,
  NextButton,
  Body,
  Subtitle,
  Text,
} from './Popup.styled';
import { PopupProps } from './Popup.types';

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnOverlayClick = true,
  showCloseButton = true,
  content,
  subtitle,
  currentStep,
  totalSteps,
  onStepChange,
}) => {
  const showPrevButton = currentStep !== undefined && currentStep > 1;
  const showNextButton =
    currentStep !== undefined &&
    totalSteps !== undefined &&
    currentStep < totalSteps;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Overlay isOpen={isOpen} onClick={closeOnOverlayClick ? onClose : undefined}>
      <Content className={className} onClick={handleContentClick}>
        {showCloseButton && (
          <CloseButton type="button" onClick={onClose} aria-label="Закрыть">
            <span />
            <span />
          </CloseButton>
        )}
        {showPrevButton && onStepChange && (
          <PrevButton
            type="button"
            onClick={() => onStepChange(currentStep - 1)}
            aria-label="Предыдущий шаг"
          >
            <span />
            <span />
          </PrevButton>
        )}
        {showNextButton && onStepChange && (
          <NextButton
            type="button"
            onClick={() => onStepChange(currentStep + 1)}
            aria-label="Следующий шаг"
          >
            <span />
            <span />
          </NextButton>
        )}
        <Header>
          <Title>{title}</Title>
        </Header>
        <Subtitle>{subtitle}</Subtitle>
        <Body>
          <Text>{content}</Text>
          {children}
        </Body>
      </Content>
    </Overlay>
  );
};