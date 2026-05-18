import React from 'react';
import { Container } from './LangSwitch.styled';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export interface LangSwitchProps {
    tone?: 'light' | 'dark';
    compact?: boolean;
}

const LangSwitch: React.FC<LangSwitchProps> = ({ tone = 'dark', compact = false }) => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const toggleLanguage = () => {
        const nextLocale = locale === 'ru' ? 'en' : 'ru';
        router.push({ pathname, query }, asPath, { locale: nextLocale });
    };
    const { t } = useTranslation('common');

    return (
        <Container onClick={toggleLanguage} onKeyDown={(e) => e.key === 'Enter' && toggleLanguage()} role="button" tabIndex={0} $light={tone === 'light'} $compact={compact}>
            {t('locale')}
        </Container>
    );
};

export default LangSwitch;
