<template>
  <div
    class="bg-slate-100 dark:bg-zinc-800 rounded-lg w-full md:w-3/4 pl-5 pr-3 mb-5"
    :class="collapsed ? '' : 'pb-5'"
  >
    <div class="flex justify-between items-center text-2xl h-16">
      <div class="truncate mr-5">
        <Icon v-if="icon" :name="icon" class="text-3xl" />
        {{ title }}
      </div>
      <Icon
        @click="collapsed = !collapsed"
        class="cursor-pointer"
        :name="collapsed ? 'bi:chevron-down' : 'bi:chevron-up'"
      />
    </div>
    <div :class="collapsed ? 'hidden' : ''">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  }
});

const { icon, title } = toRefs(props);
const collapsed = ref(true);
</script>
