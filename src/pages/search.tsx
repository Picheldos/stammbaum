import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React, { useState } from 'react';
import Layout from '@/components/common/Layout/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
    Body,
    SearchButton,
    SearchForm,
    SearchInput,
    VisuallyHiddenLabel
} from '@/components/pages/SearchPage/SearchPage.styled';

const SearchPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ meta, header, sandwich, query }) => {
    const { t } = useTranslation('search');
    const [value, setValue] = useState(query);
    const titleLine = query.trim() ? t('titleQuery', { query: query.trim() }) : t('title');

    return (
        <Layout meta={meta} header={header} sandwich={sandwich}>
            <Body>
                <h1>{titleLine}</h1>
                <SearchForm action="/search" method="get">
                    <VisuallyHiddenLabel htmlFor="site-search">Search</VisuallyHiddenLabel>
                    <SearchInput id="site-search" name="q" type="search" autoComplete="off" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Search…" />
                    <SearchButton type="submit">Search</SearchButton>
                </SearchForm>
            </Body>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const locale = ctx.locale ?? 'en';
    const query = (ctx.query.q as string) || '';
    const translations = await serverSideTranslations(locale, ['search', 'common'], {
        i18n: {
            locales: ['en', 'ru'],
            defaultLocale: 'en'
        }
    });

    const searchNs = (translations._nextI18Next?.initialI18nStore as Record<string, Record<string, { title?: string; titleQuery?: string }>>)?.[locale]
        ?.search;
    const meta = {
        title: query.trim() && searchNs?.titleQuery ? searchNs.titleQuery.replace('{{query}}', query.trim()) : searchNs?.title ?? 'Search',
        description: '',
        keywords: 'search'
    };

    return {
        props: {
            ...translations,
            meta,
            header: {},
            sandwich: {},
            query
        }
    };
};

export default SearchPage;
