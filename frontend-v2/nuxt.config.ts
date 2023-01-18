import en from './assets/locales/en.json';
import de from './assets/locales/de.json';
import { definePageMeta } from 'nuxt/dist/pages/runtime';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [{ rel: 'icon', type: "image/x-icon", href: '/favicon.ico' }]
        },
    },
    css: ['@/assets/styles/index.css'],
    imports: {
        dirs: ['stores']
    },
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL
        }
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/i18n',
        '@tailvue/nuxt',
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
    },
    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'dark'
    },
    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate']
    }
})
