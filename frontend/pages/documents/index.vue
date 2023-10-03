<script setup lang="ts">
import { Document } from 'types';

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
  title: 'Documents',
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
    <div class="flex w-full flex-col gap-2">
      <DocumentItem v-for="doc in filteredList" :key="doc.id" :doc="doc" />
    </div>
  </BasePage>
</template>
