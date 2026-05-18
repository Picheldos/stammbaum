import React from 'react';
import { Container, LogoText, Wordmark } from '@/components/blocks/Logo/Logo.styled';
import Icon from '@/icons/logo.svg';
import Link from 'next/link';

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
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Container $tone={tone}>{inner}</Container>
        </Link>
    );
};

export default Logo;
