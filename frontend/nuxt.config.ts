// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  modules: [
    '@nuxthq/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-icon',
    '@formkit/nuxt',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
  ],
  app: {
    head: {
      title: 'Invoice App',
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '~/public/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '~/public/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '~/public/favicon-16x16.png',
        },
        { rel: 'manifest', href: '~/public/site.webmanifest' },
        { rel: 'mask-icon', href: '~/public/safari-pinned-tab.svg' },
      ],
    },
  },
  colorMode: {
    classSuffix: '',
  },
  googleFonts: {
    download: true,
    base64: true,
    outputDir: 'assets/fonts',
    stylePath: 'ubuntu.css',
    families: {
      Ubuntu: {
        wght: [100, 400, 700],
      },
    },
  },
});
