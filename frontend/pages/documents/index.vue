<script setup lang="ts">
import { Document } from 'types';

const store = useDocumentStore();
const clientStore = useClientStore();
const { documents } = storeToRefs(store);
const { isOffer, getName } = useDocumentHelper();
const { filter, filteredList, setInitialList } = useFilterList<Document>();

await store.getAll();
await clientStore.getAll();
setInitialList(store.documents);

function onAction() {}

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
      <AppAccordion
        v-for="doc in filteredList"
        :id="doc.id"
        :key="doc.id"
        :title="getName(doc, clientStore.getById(doc.clientId))"
        :icon="
          isOffer(doc)
            ? 'fa6-solid:file-invoice'
            : 'fa6-solid:file-invoice-dollar'
        "
      >
        <DocumentItem :doc="doc" />
      </AppAccordion>
    </div>
  </BasePage>
</template>
