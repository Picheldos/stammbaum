import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '@/components/common/Layout/Layout';
import {
    Action,
    AuxiliaryAction,
    Close,
    Error,
    FieldLabel,
    Input,
    Modal,
    ModalBody,
    ModalHeader,
    Page,
    Status,
    Title
} from '@/components/pages/LoginPage/LoginPage.styled';
import { ApiError, formatBackendError, resetPassword } from '@/lib/api';

const isValidResetToken = (s: string) => /^[A-Za-z0-9._\-+/=]+$/.test(s);
const validatePassword = (s: string) => s.length >= 8 && /[0-9]/.test(s) && /[A-Za-z]/.test(s);

const ResetPasswordPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    const router = useRouter();
    const isRu = router.locale === 'ru';
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const t = typeof router.query.token === 'string' ? router.query.token : '';
        if (t && isValidResetToken(t)) setToken(t);
        else {
            setError(isRu ? 'Недействительная или устаревшая ссылка для восстановления.' : 'The reset link is invalid or has expired.');
        }
    }, [router.query.token, isRu]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setInfo('');
        if (!token) return;
        if (!validatePassword(password)) {
            setError(isRu ? 'Пароль должен быть минимум 8 символов и содержать буквы и цифры' : 'Password must be at least 8 chars and include letters and digits');
            return;
        }
        if (password !== confirm) {
            setError(isRu ? 'Пароли не совпадают' : "Passwords don't match");
            return;
        }
        setBusy(true);
        try {
            await resetPassword(token, password);
            setInfo(isRu ? 'Пароль изменён. Теперь можно войти.' : 'Password changed. You can now sign in.');
            setSent(true);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.code === 'invalid_token'
                    ? (isRu ? 'Ссылка для сброса недействительна или использована. Запросите новую.' : 'Reset token is invalid or already used. Request a new one.')
                    : err.message || (isRu ? 'Не удалось сбросить пароль' : 'Failed to reset password'));
            } else {
                setError(formatBackendError(err, isRu ? 'Ошибка сети' : 'Network error'));
            }
        } finally {
            setBusy(false);
        }
    };

    const handleDone = () => { void router.push('/login'); };

    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Page>
                <Modal $mode="auth">
                    <ModalHeader>
                        <Title>{isRu ? 'Новый пароль' : 'New password'}</Title>
                        <Close type="button" aria-label={isRu ? 'Закрыть' : 'Close'} onClick={handleDone}>×</Close>
                    </ModalHeader>
                    <ModalBody>
                        {sent ? (
                            <>
                                {info && <Status role="status">{info}</Status>}
                                <AuxiliaryAction type="button" onClick={handleDone}>
                                    {isRu ? 'Войти' : 'Sign in'}
                                </AuxiliaryAction>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                                <FieldLabel htmlFor="reset-password">{isRu ? 'Новый пароль' : 'New password'}</FieldLabel>
                                <Input
                                    id="reset-password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={isRu ? 'Введите пароль*' : 'Enter password*'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={busy}
                                />
                                <FieldLabel htmlFor="reset-password-confirm">{isRu ? 'Введите пароль ещё раз' : 'Confirm your password'}</FieldLabel>
                                <Input
                                    id="reset-password-confirm"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder={isRu ? 'Введите пароль ещё раз*' : 'Enter password again*'}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    disabled={busy}
                                />
                                {error && <Error role="alert">{error}</Error>}
                                <Action type="submit" disabled={busy || !token}>
                                    {isRu ? 'Сбросить пароль' : 'Reset password'}
                                </Action>
                                <AuxiliaryAction type="button" onClick={handleDone}>
                                    {isRu ? 'Назад к входу' : 'Back to sign in'}
                                </AuxiliaryAction>
                            </form>
                        )}
                    </ModalBody>
                </Modal>
            </Page>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common', 'account'], {
        i18n: { locales: ['en', 'ru'], defaultLocale: 'en' }
    });
    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'Сброс пароля' : 'Reset password',
                description: '',
                keywords: ''
            },
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        }
    };
};

export default ResetPasswordPage;