import { StatisticsResponse } from '~/types';
import { Logger } from '~/helper/logger.helper';

export const useStatsStore = defineStore('stats', () => {
  const logger = new Logger('statsStore');
  const stats = ref<StatisticsResponse>({} as StatisticsResponse);
  const error = ref<string>();

  async function getStats() {
    try {
      const { apiUrl, apiVersion } = useRuntimeConfig().public;
      const { data, error: reqErr } = await useFetch<StatisticsResponse>(
        `${apiUrl}/${apiVersion}/statistics`
      );

      if (!data.value || reqErr.value) {
        error.value = reqErr.value?.message;
        throw error;
      }

      stats.value = data.value;
      stats.value.updatedAt = new Date(data.value.updatedAt);
    } catch (error) {
      logger.error('failed to get stats', error);
    }
  }
  return { stats, error, getStats };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHealthStore, import.meta.hot));
}
