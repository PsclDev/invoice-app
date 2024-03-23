export const useSettingStore = defineStore('setting', () => {
  const i18n = useI18n();
  const logger = useLogger('settingStore');
  const toast = useToast();
  const settings = ref<Setting[]>([]);
  const reqUrl = useApiUrl() + '/setting';

  async function getAll() {
    try {
      logger.info('settingStore.getSettings');
      const { data, error } = await useFetch<Setting[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      settings.value = data.value;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('SETTINGS.STORE.GET_ALL_FAILED'),
      });
      logger.error('failed to get settings', error);
    }
  }

  async function update(setting: Setting) {
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
      toast.add({
        color: 'red',
        title: i18n.t('SETTINGS.STORE.UPDATE_FAILED', { name: setting.title }),
      });
      logger.error('failed to update settings', error);
    }
  }

  return { settings, getAll, update };
});
