<script setup lang="ts">
const { t } = useI18n();
const store = useDocumentStore();
const clientStore = useClientStore();
const { documents } = storeToRefs(store);
const router = useRouter();
const { filter, filteredList, setInitialList } = useFilterList<Document>();

await store.getAll();
await clientStore.getAll();
setInitialList(store.documents);

function onAction() {
  router.push('/documents/new');
}

function onSearch(searchterm: string) {
  filter(searchterm);
}

watch(documents, () => {
  setInitialList(documents.value);
});

useHead({
  title: t('DOCUMENTS.TITLE'),
});
</script>

<template>
  <BasePage
    title="DOCUMENTS.TITLE"
    :with-actions="true"
    search-placeholder="DOCUMENTS.SEARCH_PLACEHOLDER"
    action-label="DOCUMENTS.NEW"
    @action="onAction"
    @search="onSearch"
  >
    <div v-if="filteredList.length > 0" class="flex w-full flex-col gap-2">
      <DocumentItem v-for="doc in filteredList" :key="doc.id" :doc="doc" />
    </div>
    <div v-else class="mt-24 flex justify-center text-slate-400">
      {{ t('COMMON.LABELS.NO_DATA') }}
    </div>
  </BasePage>
</template>
~/models
