import React, { useState } from 'react';
import { Container, Title, Subtitle, PlusButton, ImageContainer } from './AboutBlock.styled';
import { Popup } from '@/components/common/Popup/Popup'; // или создай, если нет

export interface AboutBlockProps {
  variant?: 'step' | 'image' | 'text' | 'empty';
  stepNumber?: number;
  title?: string;
  subtitle?: string;
  image?: string;
  popupTitle?: string;
  popupContent?: string;
  className?: string;
  color?: string;
}

export const AboutBlock: React.FC<AboutBlockProps> = ({
  variant = 'step',
  stepNumber,
  title,
  subtitle,
  image,
  popupTitle,
  popupContent,
  className = '',
  color,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePlusClick = () => {
    if (popupContent) {
      setIsPopupOpen(true);
    }
  };

  return (
    <>
      <Container variant={variant} color={color} className={className}>
        {variant === 'image' && image && (
          <ImageContainer>
            <img src={image} alt="Family" />
          </ImageContainer>
        )}

        {variant === 'step' && (
          <>
            {stepNumber && <div className="step-number">Шаг {stepNumber}</div>}
            {title && <Title>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            
            <PlusButton onClick={handlePlusClick}>+</PlusButton>
          </>
        )}

        {variant === 'text' && (
          <>
            {title && <Title>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </>
        )}

        {variant === 'empty' && <div className="empty-block" />}
      </Container>

      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={popupTitle || title || ''}
        content={popupContent || ''}
      />
    </>
  );
};