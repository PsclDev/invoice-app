import en from './assets/locales/en.json';
import de from './assets/locales/de.json';

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    host: '0',
  },
  head: {
    title: 'Invoice App',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/scss/index.scss'],

  styleResources: {
    scss: [
      '../node_modules/bootstrap/scss/_functions.scss',
      '../node_modules/bootstrap/scss/_variables.scss',
      'vue-multiselect/dist/vue-multiselect.min.css',
      '~assets/scss/mixins.scss',
      '~assets/scss/variables.scss',
    ],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/bootstrap.ts', mode: 'client' },
    { src: '@/plugins/axios-accessor.ts' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    // Equivalent to { path: '~/components' }
    '~/components',
    { path: '~/components/app', extensions: ['vue'] },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-fonts',
    '@nuxtjs/fontawesome',
  ],

  googleFonts: {
    families: {
      Barlow: true,
    },
  },

  fontawesome: {
    icons: {
      solid: true,
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/dayjs',
    'nuxt-highcharts'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL,
  },

  publicRuntimeConfig: {
    apiBaseUrl: process.env.BASE_URL,
  },

  i18n: {
    vuex: false,
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'de',
        name: 'German',
      },
    ],
    defaultLocale: 'en',
    vueI18n: {
      messages: { en, de },
    },
  },

  dayjs: {
    plugins: ['customParseFormat'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
