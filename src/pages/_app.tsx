import { useMemo } from 'react';
import { AppProps } from 'next/app';
import '@/style/fonts.css';
import { RecoilRoot } from 'recoil';
import 'swiper/css';
import AppWrapper from '@/components/common/AppWrapper/AppWrapper';
import { appWithTranslation } from 'next-i18next';
import { Playfair_Display, Manrope } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600'],
    variable: '--font-playfair-display',
    display: 'swap'
});

const manrope = Manrope({
    subsets: ['latin', 'cyrillic'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-manrope',
    display: 'swap'
});

interface InitialI18nStore {
    [locale: string]: {
        [namespace: string]: Record<string, unknown>;
    };
}

interface NextI18NextProps {
    initialI18nStore: InitialI18nStore;
    initialLocale: string;
    ns: string[];
    userConfig: Record<string, unknown>;
}

// Клиентский кэш всех уже загруженных i18n-ресурсов (locale -> namespace).
// appWithTranslation пересоздаёт i18n-инстанс при клиентской навигации,
// включая в него ресурсы только новой страницы (_nextI18Next.initialI18nStore).
// Старая страница в этот момент ещё видна — идёт анимация выхода
// (SwitchTransition, ~800 мс), — и без кэша её переводы («index», «tree», …)
// теряются: вместо заголовков рендерятся ключи («имена переменных»).
// Кэш накапливает ресурсы всех посещённых страниц, поэтому любой
// пересозданный инстанс продолжает содержать неймспейсы уходящей страницы.
// Только клиент: на сервере модульный синглтон загрязнялся бы между запросами.
const resourcesCache: InitialI18nStore = {};

const mergeInitialI18nStore = (store: InitialI18nStore): InitialI18nStore => {
    for (const [locale, namespaces] of Object.entries(store)) {
        resourcesCache[locale] = { ...resourcesCache[locale], ...namespaces };
    }
    return resourcesCache;
};

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <RecoilRoot>
            <div className={`${playfairDisplay.variable} ${manrope.variable}`}>
                <AppWrapper pageProps={pageProps} Component={Component} router={router} />
            </div>
        </RecoilRoot>
    );
};

const I18nApp = appWithTranslation(MyApp);

// Аугментация выполняется НАД appWithTranslation: инстанс i18n создаётся
// именно в обёртке из сырых pageProps, поэтому собранный кэш ресурсов нужно
// подмешать в _nextI18Next.initialI18nStore до того, как обёртка его увидит.
const MyAppRoot: React.FC<AppProps> = (props) => {
    const augmentedPageProps = useMemo(() => {
        const nextI18Next = props.pageProps?._nextI18Next as NextI18NextProps | undefined;
        if (typeof window === 'undefined' || !nextI18Next?.initialI18nStore) {
            return props.pageProps;
        }
        return {
            ...props.pageProps,
            _nextI18Next: {
                ...nextI18Next,
                initialI18nStore: mergeInitialI18nStore(nextI18Next.initialI18nStore)
            }
        };
    }, [props.pageProps]);

    return <I18nApp {...props} pageProps={augmentedPageProps} />;
};

export default MyAppRoot;
