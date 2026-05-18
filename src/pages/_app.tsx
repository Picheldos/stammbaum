import { AppProps } from 'next/app';
import '@/style/fonts.css';
import { RecoilRoot } from 'recoil';
import 'swiper/css';
import AppWrapper from '@/components/common/AppWrapper/AppWrapper';
import { appWithTranslation } from 'next-i18next';
import { Playfair_Display, Inter } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600'],
    variable: '--font-playfair-display',
    display: 'swap'
});

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap'
});

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <RecoilRoot>
            <div className={`${playfairDisplay.variable} ${inter.variable}`}>
                <AppWrapper pageProps={pageProps} Component={Component} router={router} />
            </div>
        </RecoilRoot>
    );
};

export default appWithTranslation(MyApp);
