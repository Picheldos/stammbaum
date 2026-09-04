import React from 'react';
import Image from 'next/image';
import { Container, Title, Subtitle, PlusButton, ImageContainer, StepNumber } from './AboutBlock.styled';

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
  onPopupOpen?: () => void;
}

export const AboutBlock: React.FC<AboutBlockProps> = ({
  variant = 'step',
  stepNumber,
  title,
  subtitle,
  image,
  popupContent,
  className = '',
  color,
  onPopupOpen,
}) => {
  const handlePlusClick = () => {
    if (popupContent && onPopupOpen) {
      onPopupOpen();
    }
  };

  return (
    <Container variant={variant} color={color} className={className}>
        {variant === 'image' && image && (
          <ImageContainer>
            <Image
              src={image}
              fill
              alt="Family"
              quality={100}
              style={{ objectFit: 'cover', objectPosition: 'center' }}

            />
          </ImageContainer>
        )}

        {variant === 'step' && (
          <>
            {stepNumber && <StepNumber>Шаг {stepNumber}</StepNumber>}
            {title && <Title $variant={variant}>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            
            <PlusButton type="button" aria-label={title ? `Подробнее: ${title}` : 'Подробнее'} onClick={handlePlusClick}>+</PlusButton>
          </>
        )}

        {variant === 'text' && (
          <>
            {title && <Title $variant={variant}>{title}</Title>}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </>
        )}

        {variant === 'empty' && <div className="empty-block" />}
    </Container>
  );
};
