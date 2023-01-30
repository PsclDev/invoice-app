import { DefaultConfigOptions } from '@formkit/vue';
import { genesisIcons } from '@formkit/icons';
import { generateClasses } from '@formkit/themes';
import genesis from '@formkit/themes/tailwindcss/genesis';

const config: DefaultConfigOptions = {
  icons: { ...genesisIcons },
  config: {
    classes: generateClasses(genesis)
  }
};

export default config;
