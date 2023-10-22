import { appVersion, buildSha, buildTime } from '../app-version';

export const useHealthStore = defineStore('health', () => {
  const logger = useLogger('healthStore');
  const i18n = useI18n();
  const toast = useToast();
  const frontendVersion = useLocalStorage('app-frontend-version', '1.0.0');
  const backendVersion = useLocalStorage('app-backend-version', '1.0.0');
  const backendAvailable = ref(false);
  const ShowingBackendUnavailableToast = ref(false);
  const reqUrl = useBaseApiUrl() + '/health';

  async function getHealth() {
    try {
      logger.info('healthStore.getHealth');
      const { data, error } = await useFetch<{
        appVersion: string;
        buildSha: string;
        buildTime: string;
      }>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }
      backendAvailable.value = true;
      ShowingBackendUnavailableToast.value = false;
      toast.remove('backend-unavailable');

      logger.info(
        `Current frontend version: ${appVersion}, build: ${buildSha}, time: ${buildTime}`,
      );
      if (frontendVersion.value !== appVersion) {
        toast.add({
          color: 'blue',
          title: i18n.t('HEALTH.FRONTEND_UPDATE', {
            oldVersion: frontendVersion.value,
            newVersion: appVersion,
          }),
        });
        frontendVersion.value = appVersion;
      }

      logger.info(
        `Current backend version: ${data.value.appVersion}, build: ${data.value.buildSha}, time: ${data.value.buildTime}`,
      );
      if (backendVersion.value !== data.value.appVersion) {
        toast.add({
          color: 'blue',
          title: i18n.t('HEALTH.BACKEND_UPDATE', {
            oldVersion: backendVersion.value,
            newVersion: data.value.appVersion,
          }),
        });

        backendVersion.value = data.value.appVersion;
      }
    } catch (error) {
      logger.error(error);
      backendAvailable.value = false;
      if (!ShowingBackendUnavailableToast.value) {
        ShowingBackendUnavailableToast.value = true;
        toast.add({
          id: 'backend-unavailable',
          color: 'red',
          title: i18n.t('HEALTH.BACKEND_UNAVAILABLE'),
          timeout: 0,
        });
      }
    }
  }

  return { backendAvailable, backendVersion, frontendVersion, getHealth };
});
