import { genesisIcons } from '@formkit/icons';
import { generateClasses } from '@formkit/themes';
import { defineFormKitConfig } from '@formkit/vue';
import tailwindFormkit from 'assets/styles/tailwind-formkit';

export default defineFormKitConfig({
  icons: {
    ...genesisIcons,
  },
  config: {
    classes: generateClasses(tailwindFormkit),
  },
});
