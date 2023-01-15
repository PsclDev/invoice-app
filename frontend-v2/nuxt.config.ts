import en from './assets/locales/en.json';
import de from './assets/locales/de.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxtjs/color-mode',
        'nuxt-icon',
        '@formkit/nuxt'
    ],
    i18n: {
        strategy: 'no_prefix',
        locales: [
            {
                code: 'en',
            },
            {
                code: 'de',
            },
        ],
        defaultLocale: 'en',
        vueI18n: {
            messages: { en, de },
        },
    }
})
