<script setup lang="ts">
import { Client } from 'types';

const store = useClientStore();
const { clients } = storeToRefs(store);
const { isCompany, getName } = useClientHelper();
const { filter, filteredList, setInitialList } = useFilterList<Client>();

await store.getAll();
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
  title: 'Clients',
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
      <AppAccordion
        v-for="client in filteredList"
        :id="client.id"
        :key="client.id"
        :title="getName(client)"
        :icon="isCompany(client) ? 'mdi:person-tie' : 'mdi:person'"
      >
        <ClientItem :client="client"></ClientItem>
      </AppAccordion>
    </div>
  </BasePage>
</template>
