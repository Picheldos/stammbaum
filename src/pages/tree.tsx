import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AuthGuard from '@/components/common/AuthGuard/AuthGuard';
import FamilyTree from '@/components/sections/FamilyTree/FamilyTree';

const TreePage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <AuthGuard>
                <FamilyTree />
            </AuthGuard>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common', 'tree'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'Семейное древо — Stammbaum' : 'Family tree — Stammbaum',
                description:
                    locale === 'ru'
                        ? 'Постройте генеалогическое древо: добавляйте родственников, связи и важные даты.'
                        : 'Build your genealogical tree: add relatives, relationships and key dates.',
                keywords: 'stammbaum, tree'
            },
            header: { variant: 'app' },
            sandwich: {},
            ...translations
        },
        revalidate: 120
    };
};

export default TreePage;
