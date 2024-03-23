<script lang="ts" setup>
const props = defineProps({
  client: {
    type: Object as PropType<Client>,
    required: true,
  },
});

const router = useRouter();
const { client } = toRefs(props);
const { getName, isCompany } = useClientHelper();
const { formatDate } = useCustomDateHelper();
const formRef = ref([]);
const mode = ref<ViewMode>(ViewMode.VIEW);

const onNewDocument = () => {
  router.push({
    name: 'documents-new',
    query: {
      clientId: client.value.id,
    },
  });
};

const actions: Action[] = [
  {
    icon: 'material-symbols:edit-document',
    func: onNewDocument,
  },
];
</script>

<template>
  <AppAccordion
    :id="client.id"
    :title="getName(client)"
    :icon="isCompany(client) ? 'mdi:person-tie' : 'mdi:person'"
    :actions="actions"
  >
    <div class="flex w-full flex-col items-center justify-center px-4 sm:px-12">
      <div
        class="flex w-full justify-around gap-5 pb-3 text-slate-400 dark:text-slate-600"
      >
        <small class="text-center">
          {{ $t('COMMON.LABELS.CREATED_AT') }}:
          {{ formatDate(client.createdAt, true) }}
        </small>
        <small class="text-center">
          {{ $t('COMMON.LABELS.UPDATED_AT') }}:
          {{ formatDate(client.updatedAt, true) }}
        </small>
      </div>
      <ClientView
        v-if="mode === ViewMode.VIEW"
        v-model="mode"
        :client="client"
      />
      <ClientForm
        v-if="mode === ViewMode.EDIT"
        ref="formRef"
        v-model="mode"
        :form-mode="
          client.id.includes('new-') ? FormMode.CREATE : FormMode.EDIT
        "
        :client-id="client.id"
      />
    </div>
  </AppAccordion>
</template>
~/models
