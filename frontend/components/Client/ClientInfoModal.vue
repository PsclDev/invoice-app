<script setup lang="ts">
import { Client } from '~/types';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const { isCompany } = useClientHelper();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <UModal
    :model-value="modelValue"
    :ui="{ width: 'sm:max-w-4xl' }"
    @close="emit('update:modelValue', !modelValue)"
  >
    <UCard
      :ui="{ divide: 'divide-y divide-slate-100 dark:divide-neutral-800' }"
    >
      <template #header>
        <div class="flex justify-between">
          <p>{{ $t('CLIENTS.MODAL.INFO.TITLE') }}</p>
          <button @click="emit('update:modelValue', !modelValue)">
            <Icon name="formkit:close" size="24" />
          </button>
        </div>
      </template>
      <div class="flex w-full flex-col items-center justify-center gap-5">
        <div class="flex w-full flex-col gap-5">
          <AppGroup v-if="isCompany(client)">
            <AppViewItem
              label="CLIENTS.LABELS.COMPANY"
              :value="client.company"
            />
            <AppViewItem label="CLIENTS.LABELS.VAT" :value="client.vat" />
          </AppGroup>

          <AppGroup>
            <AppViewItem
              label="CLIENTS.LABELS.GENDER"
              :value="$t(`CLIENTS.GENDER.${client.gender}`)"
            />
            <AppViewItem
              label="CLIENTS.LABELS.FIRSTNAME"
              :value="client.firstname"
            />
            <AppViewItem
              label="CLIENTS.LABELS.LASTNAME"
              :value="client.lastname"
            />
          </AppGroup>

          <AppGroup>
            <AppViewItem label="CLIENTS.LABELS.STREET" :value="client.street" />
            <AppViewItem
              label="CLIENTS.LABELS.POSTAL_CODE"
              :value="client.postalCode"
            />
            <AppViewItem label="CLIENTS.LABELS.CITY" :value="client.city" />
          </AppGroup>

          <AppGroup v-if="client.email">
            <AppViewItem label="CLIENTS.LABELS.EMAIL" :value="client.email" />
          </AppGroup>
        </div>
      </div>
    </UCard>
  </UModal>
</template>
