import { HealthResponse } from '~/types';

export const useHealthStore = defineStore('health', () => {
  const logger = useLogger('healthStore');
  const toast = useToast();
  const reqUrl = useBaseApiUrl() + '/health';
  const apiIsRunning = ref(false);
  const dbIsRunning = ref(false);
  const lastCheck = ref(Date.now());

  async function checkHealth() {
    try {
      const { data } = await useFetch<HealthResponse>(reqUrl);
      lastCheck.value = Date.now();

      if (data.value) {
        apiIsRunning.value = data.value!.info.api.status === 'up';
        dbIsRunning.value = data.value!.info.database.status === 'up';
        return;
      }

      apiIsRunning.value = false;
      dbIsRunning.value = false;

      toast.show('danger', 'toast.health.no-response');
    } catch (error) {
      logger.error('failed to check health', error);
      toast.show('danger', 'toast.health.failed');
    }
  }

  return { apiIsRunning, dbIsRunning, lastCheck, checkHealth };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHealthStore, import.meta.hot));
}
