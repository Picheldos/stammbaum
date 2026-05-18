import React from 'react';
import { Container } from '@/components/ui/CloseButton/CloseButton.styled';

export interface CloseButtonProps {
    onClick: () => void;
    tone?: 'dark' | 'light';
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, tone = 'dark' }) => {
    return (
        <Container onClick={onClick} $tone={tone}>
            <span />
            <span />
        </Container>
    );
};

export default CloseButton;
