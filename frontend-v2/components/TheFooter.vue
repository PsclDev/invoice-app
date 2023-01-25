<template>
  <div
    class="fixed left-0 bottom-0 bg-slate-50 dark:bg-zinc-900 pb:2 md:pb-4 w-full"
  >
    <div class="flex justify-center gap-5 md:gap-10">
      <p>{{ $t('footer.checked') }}: {{ lastChecked }}</p>
      <Icon
        class="select-none"
        :class="healthStore.apiIsRunning ? 'text-emerald-400' : 'text-red-500'"
        size="24px"
        name="material-symbols:computer"
      />
      <Icon
        class="select-none"
        :class="healthStore.dbIsRunning ? 'text-emerald-400' : 'text-red-500'"
        size="24px"
        name="material-symbols:database"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';

const healthStore = useHealthStore();
const { lastCheck } = storeToRefs(healthStore);
healthStore.checkHealth();

onMounted(() => {
  window.setInterval(() => {
    healthStore.checkHealth();
  }, 90000);
});

const lastChecked = computed(() =>
  DateTime.fromMillis(lastCheck.value).toLocaleString(DateTime.TIME_24_SIMPLE)
);
</script>
