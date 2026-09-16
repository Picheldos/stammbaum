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
    Modal,
    ModalBody,
    ModalHeader,
    Page,
    Status,
    Title
} from '@/components/pages/LoginPage/LoginPage.styled';
import { ApiError, formatBackendError, resendVerification, verifyEmail } from '@/lib/api';

const isValidToken = (s: string) => /^[A-Za-z0-9._\-+/=]+$/.test(s);
const isLooksLikeEmail = (s: string) => /.+@.+\..+/.test(s);

const VerifyEmailPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    const router = useRouter();
    const isRu = router.locale === 'ru';

    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);
    const [status, setStatus] = useState<'verifying' | 'verified' | 'error'>('verifying');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = typeof router.query.token === 'string' ? router.query.token : '';
        if (!token || !isValidToken(token)) {
            setStatus('error');
            setError(isRu ? 'Ссылка подтверждения недействительна.' : 'The verification link is invalid.');
            return;
        }
        const doVerify = async () => {
            setStatus('verifying');
            try {
                const user = await verifyEmail(token);
                if (user.isVerified) {
                    setStatus('verified');
                    void router.replace('/login?notice=verified');
                } else {
                    setError(isRu ? 'Email не подтверждён.' : 'Email is not verified.');
                    setStatus('error');
                }
            } catch (err) {
                if (err instanceof ApiError) {
                    if (err.code === 'invalid_token' || err.code === 'expired_token') {
                        setError(isRu
                            ? 'Ссылка подтверждения недействительна или устарела. Введите email, чтобы запросить новое письмо.'
                            : 'The verification link is invalid or expired. Enter your email to request a new one.');
                    } else {
                        setError(err.message || (isRu ? 'Не удалось подтвердить email.' : 'Could not verify email.'));
                    }
                } else {
                    setError(formatBackendError(err, isRu ? 'Ошибка сети' : 'Network error'));
                }
                setStatus('error');
            }
        };
        void doVerify();
    }, [router.query.token, isRu, router]);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !isLooksLikeEmail(email)) {
            setError(isRu ? 'Введите корректный email' : 'Enter a valid email');
            return;
        }
        setError('');
        setResending(true);
        try {
            await resendVerification(email.trim());
            setStatus('verifying');
            void router.replace('/login?notice=checkmail');
        } catch (err) {
            setError(formatBackendError(err, isRu ? 'Не удалось отправить письмо' : 'Failed to send email'));
        } finally {
            setResending(false);
        }
    };

    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Page>
                <Modal $mode="auth">
                    <ModalHeader>
                        <Title>{isRu ? 'Подтверждение email' : 'Verify your email'}</Title>
                        <Close type="button" aria-label={isRu ? 'Закрыть' : 'Close'} onClick={() => void router.push('/login')}>×</Close>
                    </ModalHeader>
                    <ModalBody>
                        {status === 'verifying' ? (
                            <Status role="status">
                                {isRu ? 'Подтверждаем email…' : 'Verifying your email…'}
                            </Status>
                        ) : status === 'verified' ? (
                            <Status role="status">
                                {isRu ? 'Email подтверждён.' : 'Email verified.'}
                            </Status>
                        ) : (
                            <>
                                {error && <Error role="alert">{error}</Error>}
                                <form onSubmit={handleResend} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                                    <label htmlFor="verify-email-input" style={{ fontSize: '0.8rem' }}>
                                        {isRu ? 'Введите email для повторной отправки письма' : 'Enter your email to resend the verification message'}
                                    </label>
                                    <input
                                        id="verify-email-input"
                                        type="email"
                                        autoComplete="email"
                                        placeholder={isRu ? 'Введите email' : 'Enter your email'}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <Action type="submit" disabled={resending}>
                                        {isRu ? 'Повторить отправку письма' : 'Resend verification email'}
                                    </Action>
                                    <AuxiliaryAction type="button" onClick={() => void router.push('/login')}>
                                        {isRu ? 'Назад к входу' : 'Back to sign in'}
                                    </AuxiliaryAction>
                                </form>
                            </>
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
                title: locale === 'ru' ? 'Подтверждение email' : 'Verify your email',
                description: '',
                keywords: ''
            },
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        }
    };
};

export default VerifyEmailPage;