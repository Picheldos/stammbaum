import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
    Action,
    AuxiliaryAction,
    CheckboxRow,
    Close,
    Error,
    FieldLabel,
    Input,
    LoginForm,
    Modal,
    ModalBody,
    ModalHeader,
    Page,
    RegisterForm,
    Status,
    Tab,
    Tabs,
    Title
} from '@/components/pages/LoginPage/LoginPage.styled';

type User = { username: string; email: string; password: string };

function getUsers(): User[] {
    try {
        const raw = localStorage.getItem('stammbaum_users');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: User[]) {
    localStorage.setItem('stammbaum_users', JSON.stringify(users));
}

function setSession(user: { username: string; email: string }) {
    const session = { ...user, token: Math.random().toString(36).slice(2) };
    localStorage.setItem('stammbaum_session', JSON.stringify(session));
}

const validateEmail = (s: string) => /.+@.+\..+/.test(s);
const validatePassword = (s: string) => s.length >= 8 && /[0-9]/.test(s) && /[A-Za-z]/.test(s);

const LoginPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    const router = useRouter();
    const isRu = router.locale === 'ru';

    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

    // login fields
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('');

    // register fields
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [policy, setPolicy] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const users = getUsers();
        const user = users.find((u) => u.username === loginName || u.email === loginName);
        if (!user) {
            setError(isRu ? 'Пользователь не найден' : 'User not found');
            return;
        }
        if (user.password !== loginPassword) {
            setError(isRu ? 'Неверный пароль' : 'Invalid password');
            return;
        }
        setSession({ username: user.username, email: user.email });
        // go to account or home
        router.push('/');
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!regName.trim()) {
            setError(isRu ? 'Введите имя пользователя' : 'Enter username');
            return;
        }
        if (!validateEmail(regEmail)) {
            setError(isRu ? 'Неверный email' : 'Invalid email');
            return;
        }
        if (!validatePassword(regPassword)) {
            setError(isRu ? 'Пароль должен быть минимум 8 символов и содержать буквы и цифры' : 'Password must be at least 8 chars and include letters and digits');
            return;
        }
        if (regPassword !== regConfirm) {
            setError(isRu ? 'Пароли не совпадают' : "Passwords don't match");
            return;
        }
        if (!policy) {
            setError(isRu ? 'Подтвердите согласие с политикой' : 'Accept personal data policy');
            return;
        }

        const users = getUsers();
        if (users.find((u) => u.username === regName || u.email === regEmail)) {
            setError(isRu ? 'Пользователь с таким именем или email уже существует' : 'User with this name or email already exists');
            return;
        }

        const newUser: User = { username: regName, email: regEmail, password: regPassword };
        users.push(newUser);
        saveUsers(users);
        setSession({ username: newUser.username, email: newUser.email });
        router.push('/');
    };

    const handleForgot = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!validateEmail(forgotEmail)) {
            setError(isRu ? 'Введите корректный email' : 'Enter a valid email');
            return;
        }
        setResetSent(true);
    };

    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Page>
                <Modal $mode={mode}>
                    <ModalHeader>
                        <Title>{isRu ? 'Авторизация' : 'Authorization'}</Title>
                        <Close type="button" aria-label={isRu ? 'Закрыть' : 'Close'} onClick={() => router.push('/')}>×</Close>
                    </ModalHeader>
                    <ModalBody>
                        <Tabs>
                            <Tab $active={mode === 'login'} onClick={() => setMode('login')}>
                                {isRu ? 'Войти' : 'Login'}
                            </Tab>
                            <Tab $active={mode === 'register'} onClick={() => setMode('register')}>
                                {isRu ? 'Зарегистрироваться' : 'Register'}
                            </Tab>
                        </Tabs>

                        {mode === 'forgot' ? (
                            resetSent ? (
                                <Status role="status">
                                    {isRu ? 'Инструкции по восстановлению отправлены на почту.' : 'Recovery instructions have been sent.'}
                                    <AuxiliaryAction type="button" onClick={() => setMode('login')}>{isRu ? 'Вернуться ко входу' : 'Back to sign in'}</AuxiliaryAction>
                                </Status>
                            ) : (
                                <LoginForm onSubmit={handleForgot}>
                                    <FieldLabel htmlFor="forgot-email">E-mail</FieldLabel>
                                    <Input id="forgot-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                                    {error && <Error role="alert">{error}</Error>}
                                    <Action type="submit">{isRu ? 'Отправить инструкции' : 'Send instructions'}</Action>
                                </LoginForm>
                            )
                        ) : mode === 'login' ? (
                            <LoginForm onSubmit={handleLogin}>
                                <FieldLabel htmlFor="login-name">{isRu ? 'Имя пользователя или e-mail' : 'Username or email'}</FieldLabel>
                                <Input id="login-name" name="username" autoComplete="username" placeholder={isRu ? 'Имя пользователя или e-mail' : 'Username or email'} value={loginName} onChange={(e) => setLoginName(e.target.value)} />
                                <FieldLabel htmlFor="login-password">{isRu ? 'Пароль' : 'Password'}</FieldLabel>
                                <Input id="login-password" name="password" type="password" autoComplete="current-password" placeholder={isRu ? 'Пароль' : 'Password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                {error && <Error role="alert">{error}</Error>}
                                <Action type="submit">{isRu ? 'Войти в профиль' : 'Sign in'}</Action>
                                <AuxiliaryAction type="button" onClick={() => { setMode('forgot'); setError(''); setResetSent(false); }}>{isRu ? 'Забыли пароль?' : 'Forgot password?'}</AuxiliaryAction>
                            </LoginForm>
                        ) : (
                            <RegisterForm onSubmit={handleRegister}>
                                <FieldLabel htmlFor="reg-name">{isRu ? 'Имя пользователя' : 'Username'}</FieldLabel>
                                <Input id="reg-name" name="username" autoComplete="username" placeholder={isRu ? 'Имя пользователя*' : 'Username*'} value={regName} onChange={(e) => setRegName(e.target.value)} />
                                <FieldLabel htmlFor="reg-email">E-mail</FieldLabel>
                                <Input id="reg-email" name="email" type="email" autoComplete="email" placeholder="E-mail*" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                                <FieldLabel htmlFor="reg-password">{isRu ? 'Пароль' : 'Password'}</FieldLabel>
                                <Input id="reg-password" name="new-password" type="password" autoComplete="new-password" placeholder={isRu ? 'Пароль*' : 'Password*'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                                <FieldLabel htmlFor="reg-confirm">{isRu ? 'Повторите пароль' : 'Confirm password'}</FieldLabel>
                                <Input id="reg-confirm" name="password-confirmation" type="password" autoComplete="new-password" placeholder={isRu ? 'Введите пароль еще раз*' : 'Enter password again*'} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                                <CheckboxRow>
                                    <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
                                    <span>{isRu ? 'Я ознакомился и согласен с политикой обработки персональных данных' : "I've read and agree with the personal data processing policy"}</span>
                                </CheckboxRow>
                                {error && <Error role="alert">{error}</Error>}
                                <Action type="submit">{isRu ? 'Зарегистрироваться' : 'Register'}</Action>
                            </RegisterForm>
                        )}
                    </ModalBody>
                </Modal>
            </Page>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common', 'account'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'Вход' : 'Login',
                description: '',
                keywords: ''
            },
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        }
    };
};

export default LoginPage;
