import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import { BasePageProps } from '@/interfaces';
import Sandwich from '@/components/common/Sandwich/Sandwich';
import { SizesState } from '@/recoil/commonState/athom';
import { useSetRecoilState } from 'recoil';
import useResize from '@/hooks/useResize';
import { MainArea, PageShell } from '@/components/common/Layout/Layout.styled';

interface LayoutProps extends React.PropsWithChildren<BasePageProps> {}

const Layout: React.FC<LayoutProps> = ({ children, meta, header, sandwich }) => {
    const setSizesState = useSetRecoilState(SizesState);
    const sizes = useResize();

    useEffect(() => {
        if (sizes?.w && sizes.h) {
            const mobile = sizes.w < 1023 || (sizes.w < 900 && sizes.h <= 450);
            setSizesState((prev) => ({ ...prev, sizes, isMobile: mobile }));
        }
    }, [sizes, setSizesState]);

    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <meta name="og:title" content={meta.title} />
                <meta name="og:description" content={meta.description} />
            </Head>

            <PageShell>
                <Header {...header} />
                <MainArea>{children}</MainArea>
                { /* <Footer /> */ }
            </PageShell>
            <Sandwich {...sandwich} />
        </>
    );
};

export default Layout;
