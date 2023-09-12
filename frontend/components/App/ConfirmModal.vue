<script setup lang="ts">
import { ButtonColor } from '~/types';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  titleKey: {
    type: String,
    required: true,
  },
  titleProps: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  contentKey: {
    type: String,
    required: true,
  },
  contentProps: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  cancelKey: {
    type: String,
    required: false,
    default: 'COMMON.BUTTONS.CANCEL',
  },
  confirmKey: {
    type: String,
    required: false,
    default: 'COMMON.BUTTONS.DELETE',
  },
});

const emit = defineEmits(['update:modelValue', 'cancel', 'confirm']);
</script>

<template>
  <UModal
    :model-value="modelValue"
    @close="emit('update:modelValue', !modelValue)"
  >
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header> {{ $t(titleKey, titleProps) }} </template>
      {{ $t(contentKey, contentProps) }}
      <template #footer>
        <div class="flex w-full gap-5">
          <AppButton
            :label="cancelKey"
            :color="ButtonColor.BLUE"
            @click="emit('cancel')"
          />
          <AppButton
            :label="confirmKey"
            :color="ButtonColor.RED"
            @click="emit('confirm')"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
