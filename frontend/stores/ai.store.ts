export const useAiStore = defineStore('ai', () => {
  const i18n = useI18n();
  const logger = useLogger('aiStore');
  const toast = useToast();
  const reqUrl = useApiUrl() + '/ai';

  async function optimizeDescription(input: string) {
    try {
      logger.info('aiStore.optimizeDescription');
      const { data, error } = await useFetch<{ input: string; output: string }>(
        reqUrl,
        {
          method: 'POST',
          body: JSON.stringify({ input }),
        },
      );
      if (!data.value || error.value) {
        throw error.value;
      }

      return data.value.output;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('AI.STORE.OPTIMIZED_FAILED'),
      });
      logger.error('Failed to optimize description', error);
      return input;
    }
  }

  return { optimizeDescription };
});
