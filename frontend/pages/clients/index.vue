<script setup lang="ts">
import { Client } from 'types';

const { t } = useI18n();
const store = useClientStore();
const documentStore = useDocumentStore();
const { clients } = storeToRefs(store);
const { filter, filteredList, setInitialList } = useFilterList<Client>();

await store.getAll();
await documentStore.getAll();
setInitialList(store.clients);

function onAction() {
  store.newClient();
}

function onSearch(searchterm: string) {
  filter(searchterm);
}

watch(clients, () => {
  setInitialList(clients.value);
});

useHead({
  title: t('CLIENTS.TITLE'),
});
</script>

<template>
  <BasePage
    title="CLIENTS.TITLE"
    :with-actions="true"
    search-placeholder="CLIENTS.SEARCH_PLACEHOLDER"
    action-label="CLIENTS.NEW"
    @action="onAction"
    @search="onSearch"
  >
    <div class="flex w-full flex-col gap-2">
      <ClientItem
        v-for="client in filteredList"
        :key="client.id"
        :client="client"
      />
    </div>
  </BasePage>
</template>
