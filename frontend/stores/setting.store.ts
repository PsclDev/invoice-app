import { Setting } from '@/types';

export const useSettingStore = defineStore('setting', () => {
  const { t } = useI18n();
  const logger = useLogger('settingStore');
  const toast = useToast();
  const settings = ref<Setting[]>([]);
  const reqUrl = useApiUrl() + '/setting';

  async function getSettings() {
    try {
      logger.info('settingStore.getSettings');
      const { data, error } = await useFetch<Setting[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      settings.value = data.value;
    } catch (error) {
      toast.add({ color: 'red', title: t('STORE.SETTING.GET_FAILED') });
      logger.error('failed to get settings', error);
    }
  }

  async function updateSetting(setting: Setting) {
    try {
      logger.info('settingStore.updateSetting');
      const { error } = await useFetch<Setting>(`${reqUrl}/${setting.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ value: setting.value }),
      });
      if (error.value) {
        throw error.value;
      }

      settings.value = settings.value.map((s): Setting => {
        if (s.id === setting.id) {
          return setting;
        }
        return s;
      });
    } catch (error) {
      toast.add({ color: 'red', title: t('STORE.SETTING.UPDATE_FAILED') });
      logger.error('failed to update settings', error);
    }
  }

  return { settings, getSettings, updateSetting };
});
