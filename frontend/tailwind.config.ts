import FormKitVariants from '@formkit/themes/tailwindcss';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './index.html',
    './**/*.vue',
    '~/assets/styles/tailwind-formkit.ts',
  ],
  plugins: [FormKitVariants],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        white: '#fafafa',
        black: '#050505',
        'spring-green': {
          '50': '#eefff5',
          '100': '#d7ffe9',
          '200': '#b2ffd5',
          '300': '#76ffb5',
          '400': '#33f58e',
          '500': '#09de6d',
          '600': '#00c05b',
          '700': '#049148',
          '800': '#0a713c',
          '900': '#0a5d34',
          '950': '#00341a',
        },
        'cannon-pink': {
          '50': '#f9f6f8',
          '100': '#f5eef2',
          '200': '#ecdee7',
          '300': '#dec3d3',
          '400': '#c99db6',
          '500': '#b67e9c',
          '600': '#9f6380',
          '700': '#8a516b',
          '800': '#704458',
          '900': '#5f3c4b',
          '950': '#381f2a',
        },
      },
    },
  },
};
