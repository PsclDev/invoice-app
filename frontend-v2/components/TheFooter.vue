<template>
  <div class="fixed bottom-0 w-full">
    <div class="flex justify-center gap-10">
      <p>{{ $t("footer.checked") }}: {{ lastChecked }}</p>
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
import { DateTime } from "luxon";

const healthStore = useHealthStore();
healthStore.checkHealth();

onMounted(() => {
  window.setInterval(() => {
    healthStore.checkHealth();
  }, 90000);
});

const lastChecked = computed(() =>
  DateTime.fromMillis(healthStore.lastCheck).toLocaleString(
    DateTime.TIME_24_SIMPLE
  )
);
</script>
