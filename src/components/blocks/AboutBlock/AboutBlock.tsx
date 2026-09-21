import Plus from '@/icons/plus.svg';
import Image from 'next/image';
import React from 'react';
import { Container, ImageContainer, PlusButton, StepNumber, Subtitle, TextContainer, Title } from './AboutBlock.styled';

export interface AboutBlockProps {
    variant?: 'step' | 'image' | 'text' | 'empty';
    stepNumber?: number;
    title?: string;
    subtitle?: string;
    image?: string;
    className?: string;
    color?: string;
    textColor?: string;
    onPopupOpen?: () => void;
}

export const AboutBlock: React.FC<AboutBlockProps> = ({
    variant = 'step',
    stepNumber,
    title,
    subtitle,
    image,
    className = '',
    color,
    textColor,
    onPopupOpen
}) => {
    const isClickableStep = variant === 'step' && Boolean(onPopupOpen);

    const handleStepOpen = () => {
        if (isClickableStep && onPopupOpen) {
            onPopupOpen();
        }
    };

    const handleStepKeyDown = (event: React.KeyboardEvent) => {
        if (!isClickableStep) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleStepOpen();
        }
    };

    return (
        <Container
            variant={variant}
            color={color}
            $textColor={textColor}
            className={className}
            onClick={isClickableStep ? handleStepOpen : undefined}
            onKeyDown={isClickableStep ? handleStepKeyDown : undefined}
            tabIndex={isClickableStep ? 0 : undefined}
            role={isClickableStep ? 'button' : undefined}
        >
            {variant === 'image' && image && (
                <ImageContainer>
                    <Image src={image} fill alt="Family" quality={100} />
                </ImageContainer>
            )}

            {variant === 'step' && (
                <>
                    <TextContainer>
                        {stepNumber && <StepNumber>Шаг {stepNumber}</StepNumber>}
                        {title && <Title $variant={variant}>{title}</Title>}
                        {subtitle && <Subtitle>{subtitle}</Subtitle>}
                    </TextContainer>
                    <PlusButton
                        type="button"
                        aria-label={title ? `Подробнее: ${title}` : 'Подробнее'}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleStepOpen();
                        }}
                        tabIndex={-1}
                    >
                        <Plus aria-hidden />
                    </PlusButton>
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
