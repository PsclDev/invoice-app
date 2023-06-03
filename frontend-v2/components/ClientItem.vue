<template>
  <AppCollapse :title="fullname">
    <div class="flex flex-col gap-6 md:gap-3">abc</div>
  </AppCollapse>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ClientResponse } from '~~/types/client.interface';

const props = defineProps({
  client: {
    type: Object as PropType<ClientResponse>,
    required: true
  }
});

const { client } = toRefs(props);
const isCompany = ref(!!client.value.company);

const fullname = computed(() => {
  if (isCompany.value) {
    return `${client.value.company} | ${client.value.firstname} ${client.value.lastname}`;
  }

  return `${client.value.firstname} ${client.value.lastname}`;
});
</script>
