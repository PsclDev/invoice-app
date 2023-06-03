<template>
  <div class="flex flex-col w-full">
    <template v-if="error"> <Error :error="error" /> </template>
    <template v-else-if="clients">
      <div class="flex flex-col items-center">
        <SearchBar v-model="searchTerm" />
        <template v-for="client in clientsToShow">
          <ClientItem :client="client" />
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Clients'
});

const clientsStore = useClientsStore();
const { clients, error } = storeToRefs(clientsStore);
clientsStore.getClients();

const searchTerm = ref('');

const clientsToShow = computed(() => {
  if (!clients.value) return [];

  const searchTermLower = searchTerm.value.toLowerCase();
  return clients.value.filter((client) => {
    return (
      client.id.toLowerCase().includes(searchTermLower) ||
      client.company?.toLowerCase().includes(searchTermLower) ||
      client.vat?.toLowerCase().includes(searchTermLower) ||
      client.firstname.toLowerCase().includes(searchTermLower) ||
      client.lastname.toLowerCase().includes(searchTermLower) ||
      client.email.toLowerCase().includes(searchTermLower) ||
      client.street.toLowerCase().includes(searchTermLower) ||
      client.postalCode.toLowerCase().includes(searchTermLower) ||
      client.city.toLowerCase().includes(searchTermLower)
    );
  });
});
</script>
