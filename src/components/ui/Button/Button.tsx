import React from 'react';
import { Container } from './Button.styled';

export interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
    return (
        <Container onClick={onClick} disabled={disabled}>
            {text}
        </Container>
    );
};

export default Button;
