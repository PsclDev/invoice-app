import { StatisticsResponse } from '~/types';

export const useStatsStore = defineStore('stats', () => {
  const logger = useLogger('statsStore');
  const toast = useToast();
  const reqUrl = useApiUrl() + '/statistics';
  const stats = ref<StatisticsResponse>({} as StatisticsResponse);
  const error = ref<string>();

  async function getStats() {
    try {
      const { data, error: reqErr } = await useFetch<StatisticsResponse>(
        reqUrl
      );

      if (!data.value || reqErr.value) {
        error.value = reqErr.value?.message;
        throw error;
      }

      stats.value = data.value;
      stats.value.updatedAt = new Date(data.value.updatedAt);
    } catch (error) {
      logger.error('failed to get stats', error);
      toast.show('danger', 'toast.stats.failed');
    }
  }
  return { stats, error, getStats };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot));
}
