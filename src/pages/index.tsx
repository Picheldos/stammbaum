import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import { getIndexPage } from '@/lib/api';
import MainSection from '@/components/sections/MainSection/MainSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Index: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <MainSection />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const data = getIndexPage();
    const translations = await serverSideTranslations(locale!, ['index', 'common'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: data.title,
                description: locale === 'ru' ? data.descriptionRu : data.descriptionEn,
                keywords: 'stammbaum, next'
            },
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        },
        revalidate: 60
    };
};

export default Index;
