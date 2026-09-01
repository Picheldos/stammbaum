import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import Cemetery from '@/components/sections/Cemetery/Cemetery';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CemeteryPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Cemetery />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common', 'cemetery'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'Кладбище — Stammbaum' : 'Cemetery — Stammbaum',
                description:
                    locale === 'ru'
                        ? 'Раздел для усопших родственников: тёмная тема и дерево памяти будут здесь (этап проекта «Кладбище»).'
                        : 'A dedicated space for deceased relatives: darker theme and memorial tree — coming with the Cemetery milestone.',
                keywords: 'stammbaum, cemetery'
            },
            header: { variant: 'app' },
            sandwich: {},
            ...translations
        },
        revalidate: 120
    };
};

export default CemeteryPage;
