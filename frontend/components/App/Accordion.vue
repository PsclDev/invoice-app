<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    required: false,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: false,
    default: undefined,
  },
});

const collapsed = ref(true);
</script>

<template>
  <div
    class="flex w-full flex-col items-center rounded border border-slate-300 bg-slate-200 dark:border-neutral-800 dark:bg-neutral-900"
  >
    <div
      class="flex h-10 w-full cursor-default items-center justify-between p-2 text-lg"
    >
      <div class="flex items-center gap-1 truncate">
        <Icon v-if="icon" :name="icon" />
        {{ title }}
        <small v-if="id" class="text-xs text-slate-400 dark:text-slate-600"
          >#{{ id }}</small
        >
      </div>
      <div class="grow pr-3 text-end" @click="collapsed = !collapsed">
        <Icon
          class="cursor-pointer"
          :name="collapsed ? 'bi:chevron-down' : 'bi:chevron-up'"
        />
      </div>
    </div>
    <div class="w-full p-2 pb-4" :class="collapsed ? 'hidden' : ''">
      <slot />
    </div>
  </div>
</template>
