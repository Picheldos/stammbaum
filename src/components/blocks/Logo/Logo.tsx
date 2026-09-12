import React from 'react';
import { Container, LogoLink, LogoText, Wordmark } from '@/components/blocks/Logo/Logo.styled';
import Icon from '@/icons/logo.svg';

export interface LogoProps {
    /** «Марк» — иконка + название (как в футере); «wordmark» — только название в шрифте логотипа */
    presentation?: 'mark' | 'wordmark';
    tone?: 'dark' | 'light';
}

const Logo: React.FC<LogoProps> = ({ presentation = 'mark', tone = 'dark' }) => {
    const inner =
        presentation === 'wordmark' ? (
            <Wordmark>Stammbaum</Wordmark>
        ) : (
            <>
                <Icon aria-hidden />
                <LogoText>Stammbaum</LogoText>
            </>
        );

    return (
        <LogoLink href="/">
            <Container $tone={tone}>{inner}</Container>
        </LogoLink>
    );
};

export default Logo;
