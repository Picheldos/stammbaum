import { AppProps } from 'next/app';
import '@/style/fonts.css';
import { RecoilRoot } from 'recoil';
import 'swiper/css';
import AppWrapper from '@/components/common/AppWrapper/AppWrapper';
import { appWithTranslation } from 'next-i18next';
import { Playfair_Display, Manrope } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '600'],
    variable: '--font-playfair-display',
    display: 'swap'
});

const manrope = Manrope({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-manrope',
    display: 'swap'
});

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <RecoilRoot>
            <div className={`${playfairDisplay.variable} ${manrope.variable}`}>
                <AppWrapper pageProps={pageProps} Component={Component} router={router} />
            </div>
        </RecoilRoot>
    );
};

export default appWithTranslation(MyApp);
