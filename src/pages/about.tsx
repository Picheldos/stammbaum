import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AboutSection } from '@/components/sections/AboutSection/AboutSection';

const AboutPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <AboutSection />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['about', 'common'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    const aboutNs = (
        translations._nextI18Next?.initialI18nStore as Record<
            string,
            Record<string, { meta?: { title?: string; description?: string; keywords?: string } }>
        >
    )?.[locale ?? 'en']?.about;
    const meta = aboutNs?.meta
        ? { title: aboutNs.meta.title!, description: aboutNs.meta.description!, keywords: aboutNs.meta.keywords! }
        : { title: 'About', description: '', keywords: 'about' };

    return {
        props: {
            meta,
            header: { variant: 'marketing' },
            sandwich: {},
            ...translations
        },
        revalidate: 120
    };
};

export default AboutPage;
