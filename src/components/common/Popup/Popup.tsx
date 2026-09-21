import React, { useCallback, useEffect } from 'react';
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
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousScrollbarGutter = document.body.style.scrollbarGutter;
    document.body.style.overflow = 'hidden';
    document.body.style.scrollbarGutter = 'stable';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, [isOpen]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Overlay isOpen={isOpen} onClick={closeOnOverlayClick ? onClose : undefined}>
      <Content className={className} onClick={handleContentClick}>
        <Header>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Header>
        {showCloseButton && (
          <CloseButton type="button" onClick={onClose} aria-label="Закрыть">
            <span />
            <span />
          </CloseButton>
        )}
        <Body>
          <Text>{content}</Text>
          {children}
        </Body>
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
      </Content>
    </Overlay>
  );
};