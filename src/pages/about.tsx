import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { font } from '@/style/mixins';

const Body = styled.section`
    ${font('font2')};
    padding-top: 2rem;
`;

const AboutPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Body>{meta.description}</Body>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'О проекте' : 'About',
                description: locale === 'ru' ? 'Заглушка страницы «О нас».' : 'About page placeholder.',
                keywords: 'about'
            },
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        },
        revalidate: 120
    };
};

export default AboutPage;
