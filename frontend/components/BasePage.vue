<script setup lang="ts">
import { debounce } from 'lodash';

defineProps({
  title: {
    type: String,
    required: true,
  },
  withActions: {
    type: Boolean,
    required: false,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    required: false,
    default: '',
  },
  actionLabel: {
    type: String,
    required: false,
    default: '',
  },
});

const emits = defineEmits(['search', 'action']);
const searchterm = ref('');
const searchtermValid = ref(true);

watch(
  searchterm,
  debounce(() => {
    searchtermValid.value =
      searchterm.value.length >= 3 || searchterm.value.length === 0;
    emits('search', searchterm.value);
  }, 300),
);
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-5">
    <h1 class="text-2xl sm:hidden">{{ $t(title) }}</h1>
    <div
      class="flex h-full w-11/12 flex-col items-center justify-end gap-5 sm:justify-start 2xl:w-3/5"
    >
      <form
        v-if="withActions"
        class="fixed bottom-16 flex w-11/12 flex-col gap-3 bg-slate-100 py-4 dark:bg-neutral-950 sm:static sm:gap-5 sm:py-0 2xl:w-3/5"
        @submit.prevent
      >
        <div class="relative">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon name="material-symbols:search" size="28" />
          </div>
          <input
            v-model="searchterm"
            type="search"
            class="block h-11 w-full rounded border border-slate-300 bg-slate-200 p-2 pl-12 text-sm placeholder:text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:placeholder:text-slate-300"
            :placeholder="$t(searchPlaceholder)"
          />
        </div>
        <p v-if="!searchtermValid" class="text-cannon-pink-800">
          {{ $t('BASE.PAGE.MIN_LEN') }}
        </p>
        <button
          class="bg-spring-green-600 hover:bg-spring-green-700 order-last w-full rounded px-4 py-2 font-bold sm:order-2"
          @click="$emit('action')"
        >
          {{ $t(actionLabel) }}
        </button>
      </form>
      <div class="w-full sm:pb-0" :class="withActions ? 'pb-48' : 'pb-16'">
        <slot />
      </div>
    </div>
  </div>
</template>
