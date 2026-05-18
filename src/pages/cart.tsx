import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { font } from '@/style/mixins';

const Body = styled.section`
    ${font('font2')};
    padding-top: 2rem;
`;

const CartPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ meta, header, sandwich }) => {
    const { t } = useTranslation('cart');
    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Body>{t('empty')}</Body>
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale!, ['cart', 'common'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    const cartNs = (
        translations._nextI18Next?.initialI18nStore as Record<string, Record<string, { meta?: { title?: string; description?: string; keywords?: string } }>>
    )?.[locale ?? 'en']?.cart;
    const meta = cartNs?.meta
        ? { title: cartNs.meta.title!, description: cartNs.meta.description!, keywords: cartNs.meta.keywords! }
        : { title: 'Cart', description: '', keywords: 'cart' };

    return {
        props: {
            meta,
            header: {},
            sandwich: {},
            ...translations
        },
        revalidate: 60
    };
};

export default CartPage;
