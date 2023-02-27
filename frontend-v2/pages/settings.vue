<template>
  <div class="flex flex-col w-full">
    <template v-if="error"> <Error :error="error" /> </template>
    <template v-else-if="settings">
      <div class="text-5xl text-center">{{ $t('header.settings') }}</div>

      <div class="flex flex-col items-center mt-8">
        <template v-for="settingGroup in Object.keys(groupedSettings)">
          <AppCollapse class="pb-5 mb-5" :title="settingGroup">
            <div class="flex flex-col gap-6 md:gap-3">
              <template
                v-for="setting in Object.values(groupedSettings[settingGroup])"
              >
                <SettingItem :setting="setting" />
              </template>
            </div>
          </AppCollapse>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { groupBy } from 'lodash';
useHead({
  title: 'Settings'
});

const settingsStore = useSettingsStore();
const { settings, error } = storeToRefs(settingsStore);
settingsStore.getSettings();

const groupedSettings = computed(() => {
  return groupBy(settings.value, 'type');
});
</script>
