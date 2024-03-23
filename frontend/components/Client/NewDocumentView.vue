<script lang="ts" setup>
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const { client } = toRefs(props);
const { isCompany } = useClientHelper();
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-5">
    <div class="flex w-full flex-col gap-5">
      <AppGroup v-if="isCompany(client)">
        <AppViewItem label="CLIENTS.LABELS.COMPANY" :value="client.company" />
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
        <AppViewItem label="CLIENTS.LABELS.LASTNAME" :value="client.lastname" />
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
</template>
~/models
