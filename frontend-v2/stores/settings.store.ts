import { SettingResponse } from '~/types';

export const useSettingsStore = defineStore('settings', () => {
  const logger = useLogger('settingsStore');
  const toast = useToast();
  const reqUrl = useApiUrl() + '/setting';
  const settings = ref<SettingResponse[]>({} as SettingResponse[]);
  const error = ref<string>();

  async function getSettings() {
    try {
      const { data, error: reqErr } = await useFetch<SettingResponse[]>(reqUrl);

      if (!data.value || reqErr.value) {
        error.value = reqErr.value?.message;
        throw error;
      }

      settings.value = data.value;
    } catch (error) {
      logger.error('failed to get settings', error);
      toast.show('danger', 'toast.settings.get');
    }
  }

  async function updateSetting(id: string, value: string) {
    try {
      const { error: reqErr } = await useFetch<SettingResponse>(
        `${reqUrl}/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ value })
        }
      );

      if (reqErr.value) {
        error.value = reqErr.value?.message;
        throw error;
      }

      toast.show('info', 'toast.settings.updated');
    } catch (error) {
      logger.error('failed to update setting', error);
      toast.show('danger', 'toast.settings.failed');
    }
  }

  return { settings, error, getSettings, updateSetting };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
