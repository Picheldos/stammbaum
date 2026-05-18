module.exports = {
    i18n: {
        locales: ['en', 'ru'],
        defaultLocale: 'en',
        localeDetection: false
    },

    images: {
        domains: []
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: { and: [/\.(js|ts|md)x?$/] },
            use: ['@svgr/webpack']
        });
        return config;
    },

    env: {
        API_URL: process.env.API_URL,
        IMAGE_DOMAIN: process.env.IMAGE_DOMAIN
    },

    compiler: {
        styledComponents: true
    }
};
