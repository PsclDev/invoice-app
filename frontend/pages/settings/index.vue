<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { groupBy } from 'lodash';
import { SettingType } from 'types';

const { t } = useI18n();
const colorMode = useColorMode();
const settingStore = useSettingStore();
const healthStore = useHealthStore();

settingStore.getAll();

const { currentLanguage, toggleLanguage, toggleColorMode } =
  useToggleSettings();

const useDarkMode = ref(colorMode.preference === 'dark');
watch(useDarkMode, () => {
  toggleColorMode();
});

const useGerman = ref(currentLanguage.value === 'de');
watch(useGerman, () => {
  toggleLanguage();
});

const devMode = useStorage(LocalStorageKeys.DevMode, '');

function switchDevMode() {
  if (devMode.value === '') {
    devMode.value = 'app:*';
  } else {
    devMode.value = '';
  }
}

const devModeEnabled = computed(() => {
  return devMode.value !== '';
});

const groupedSettings = computed(() => {
  return groupBy(settingStore.settings, 'type');
});

const getGroupIcon = (type: SettingType) => {
  switch (type) {
    case 'PDF':
      return 'material-symbols:edit-document-rounded';
    case 'MAIL':
      return 'material-symbols:alternate-email-rounded';
    case 'GPT':
      return 'material-symbols:robot-2';
    case 'FILE':
      return 'material-symbols:attach-file-rounded';
  }
};

const showUnsavedAlert = ref(false);
const settingsItemsRefs = ref([]);
const unsavedChanges = ref<Map<string, boolean>>(new Map());

const unsavedChangesListener = (settingId: string, changes: boolean) => {
  unsavedChanges.value.set(settingId, changes);
};

onBeforeRouteLeave((_, __, next) => {
  if (unsavedChanges.value.size > 0) {
    const unsavedChangesArray = Array.from(unsavedChanges.value.values());
    if (unsavedChangesArray.includes(true)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showUnsavedAlert.value = true;
      next(false);
      return;
    }
  }
  next(true);
});

const onDiscardChanges = () => {
  for (const settingItem of settingsItemsRefs.value) {
    settingItem.onDiscard();
  }
  showUnsavedAlert.value = false;
};

const onSaveChanges = async () => {
  for (const settingItem of settingsItemsRefs.value) {
    await settingItem.onSave();
  }
  showUnsavedAlert.value = false;
};

const alertActions = computed(() => {
  return [
    {
      variant: 'solid',
      color: 'red',
      label: t('SETTINGS.ALERT.DISCARD'),
      click: onDiscardChanges,
    },
    {
      variant: 'solid',
      color: 'green',
      label: t('SETTINGS.ALERT.SAVE'),
      click: onSaveChanges,
    },
  ];
});

useHead({
  title: t('SETTINGS.TITLE'),
});
</script>

<template>
  <BasePage title="SETTINGS.TITLE">
    <UAlert
      v-show="showUnsavedAlert"
      class="mb-5"
      :title="$t('SETTINGS.ALERT.TITLE')"
      variant="subtle"
      color="amber"
      :actions="alertActions"
    />

    <div class="flex flex-col gap-5">
      <div class="flex justify-center">
        <div class="flex gap-5 sm:hidden">
          <div class="flex items-center gap-3">
            <p>{{ $t('SETTINGS.DARKMODE') }}:</p>
            <UToggle v-model="useDarkMode" />
          </div>
          <div class="flex items-center gap-3">
            <p>{{ $t('SETTINGS.GERMAN') }}:</p>
            <UToggle v-model="useGerman" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <AppAccordion
          v-for="settingGroup in groupedSettings"
          :key="settingGroup[0].type"
          :title="settingGroup[0].type"
          :icon="getGroupIcon(settingGroup[0].type)"
        >
          <div class="flex w-full flex-col gap-3">
            <SettingsItem
              v-for="setting in settingGroup"
              ref="settingsItemsRefs"
              :key="setting.id"
              :setting="setting"
              @unsaved-changes="unsavedChangesListener(setting.id, $event)"
            />
          </div>
        </AppAccordion>
      </div>
      <div class="flex justify-center">
        <div class="flex gap-5">
          <p>App Version: {{ healthStore.frontendVersion }}</p>
          <p>Backend Version: {{ healthStore.backendVersion }}</p>
        </div>
      </div>
      <div class="flex justify-center">
        <button
          class="border-cannon-pink-500 text-cannon-pink-700 flex items-center gap-2 rounded border bg-transparent px-2 py-1 text-xs"
          @click="switchDevMode"
        >
          {{ devModeEnabled ? 'Disable Dev-Mode' : 'Enable Dev-Mode' }}
          <Icon
            :name="devModeEnabled ? 'ic:round-code-off' : 'ic:round-code'"
            size="24"
          />
        </button>
      </div>
    </div>
  </BasePage>
</template>
