<script lang="ts" setup>
import { Action } from 'types';

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
  actions: {
    type: Array as PropType<Action[]>,
    required: false,
    default: () => [],
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
        <small v-if="id" class="ml-1 text-xs text-slate-400 dark:text-slate-600"
          >#{{ id }}</small
        >
      </div>

      <div class="pr-3 text-end">
        <button
          v-for="action in actions"
          :key="action.icon"
          class="hover:text-spring-green-600 dark:hover:text-spring-green-600 cursor-pointer px-2 text-black dark:text-white"
          @click="action.func"
        >
          <Icon :name="action.icon" />
        </button>

        <button
          class="cursor-pointer pl-5 text-black hover:text-slate-400 dark:text-slate-600 dark:hover:text-white"
          @click="collapsed = !collapsed"
        >
          <Icon :name="collapsed ? 'bi:chevron-down' : 'bi:chevron-up'" />
        </button>
      </div>
    </div>
    <div class="w-full p-2 pb-4" :class="collapsed ? 'hidden' : ''">
      <slot />
    </div>
  </div>
</template>
