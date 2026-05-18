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

const CataloguePage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Body>{meta.description}</Body>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['common', 'index'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    return {
        props: {
            meta: {
                title: locale === 'ru' ? 'Каталог' : 'Catalogue',
                description:
                    locale === 'ru'
                        ? 'Заглушка каталога — подключите свой API здесь.'
                        : 'Catalogue stub — plug in your product API here.',
                keywords: 'catalogue'
            },
            header: {},
            sandwich: {},
            ...translations
        },
        revalidate: 120
    };
};

export default CataloguePage;
