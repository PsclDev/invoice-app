import packageJson from '~/package.json';

export const useHealthStore = defineStore('health', () => {
  const logger = useLogger('clientStore');
  const frontendVersion = ref<string>(packageJson.version);
  const backendVersion = ref<string>('');
  const reqUrl = useBaseApiUrl() + '/health';

  async function getHealth() {
    try {
      logger.info('healthStore.getHealth');
      const { data, error } = await useFetch<{ version: string }>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      backendVersion.value = data.value.version;
    } catch (error) {
      logger.error(error);
      backendVersion.value = 'unavailable';
    }
  }

  return { frontendVersion, backendVersion, getHealth };
});
