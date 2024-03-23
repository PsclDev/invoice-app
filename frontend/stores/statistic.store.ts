export const useStatisticStore = defineStore('statistic', () => {
  const logger = useLogger('statisticStore');
  const i18n = useI18n();
  const toast = useToast();
  const reqUrl = useApiUrl() + '/statistics';
  const statistics = ref<Statistics>({} as Statistics);

  async function getStats() {
    try {
      logger.info('statisticStore.getStats');
      const { data, error } = await useFetch<Statistics>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      statistics.value = data.value;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('STATISTICS.STORE.GET_FAILED'),
      });
      logger.error('Failed to get stats', error);
    }
  }

  return { getStats, statistics };
});
