import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { font } from '@/style/mixins';
import { useRouter } from 'next/router';

const Page = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 120px);
    background: #f8f4ee;
`;

const Modal = styled.div`
    width: 360px;
    background: #ecd9bf;
    border-radius: 6px;
    box-shadow: 0 8px 0 rgba(0,0,0,0.06);
    overflow: hidden;
`;

const ModalHeader = styled.div`
    background: #637a4f;
    color: #fff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Title = styled.h3`
    margin: 0;
    font-weight: 600;
`;

const Close = styled.button`
    background: transparent;
    border: none;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
`;

const ModalBody = styled.div`
    padding: 18px;
    ${font('font2')};
`;

const Tabs = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
`;

const Tab = styled.button<{ $active?: boolean }>`
    background: ${({ $active }) => ($active ? '#55607a' : 'transparent')};
    color: ${({ $active }) => ($active ? '#fff' : '#2f3b4a')};
    border: none;
    padding: 6px 10px;
    border-radius: 4px;
    cursor: pointer;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #e6d9c2;
    background: #fff;
`;

const CheckboxRow = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #5a5150;
`;

const Action = styled.button`
    background: #55607a;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
`;

const Error = styled.div`
    color: #8b2b2b;
    font-size: 13px;
`;

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

    const [mode, setMode] = useState<'login' | 'register'>('login');

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

    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Page>
                <Modal>
                    <ModalHeader>
                        <Title>{isRu ? 'Авторизация' : 'Authorization'}</Title>
                        <Close aria-label="close">×</Close>
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

                        {mode === 'login' ? (
                            <Form onSubmit={handleLogin}>
                                <Input placeholder={isRu ? 'Имя пользователя или e-mail' : 'Username or email'} value={loginName} onChange={(e) => setLoginName(e.target.value)} />
                                <Input type="password" placeholder={isRu ? 'Пароль' : 'Password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                {error && <Error>{error}</Error>}
                                <Action type="submit">{isRu ? 'Войти в профиль' : 'Sign in'}</Action>
                            </Form>
                        ) : (
                            <Form onSubmit={handleRegister}>
                                <Input placeholder={isRu ? 'Имя пользователя' : 'Username'} value={regName} onChange={(e) => setRegName(e.target.value)} />
                                <Input placeholder="E-mail" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                                <Input type="password" placeholder={isRu ? 'Пароль' : 'Password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                                <Input type="password" placeholder={isRu ? 'Введите пароль еще раз' : 'Confirm password'} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                                <CheckboxRow>
                                    <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
                                    <span>{isRu ? 'Я ознакомился и согласен с политикой обработки персональных данных' : "I've read and agree with the personal data processing policy"}</span>
                                </CheckboxRow>
                                {error && <Error>{error}</Error>}
                                <Action type="submit">{isRu ? 'Зарегистрироваться' : 'Register'}</Action>
                            </Form>
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
