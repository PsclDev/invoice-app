<template>
  <div class="row">
    <div class="col-8 col-md-6 mb-2 p-0">
      <AppSearch :clients="store.Clients" @filtered="onFilterChanged" />
    </div>
    <div class="col text-center p-0">
      <button
        class="col-8 col-md-6 btn btn-primary px-5 font-weight-bold"
        @click="create"
      >
        {{ $t('clients.create') }}
      </button>
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <template v-if="clients.length > 0">
          <ClientItem
            v-for="client of clients"
            :key="client.id"
            :client="client"
            class="mb-2"
          />
        </template>
        <template v-else>
          <div class="text-center fw-bold text-danger">
            No Results could be found by the search term
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import ClientModule from '~/store/client';
import { Client } from '~/models';

export default Vue.extend({
  name: 'ClientsPage',
  beforeRouteLeave(__, ___, next) {
    if (this.store.clients.find((c) => c.id === '1'))
      this.store.deleteLocalClient('1');
    next();
  },
  data() {
    return {
      store: getModule(ClientModule, this.$store),
      filteredList: [] as Client[],
      isLoading: false,
    };
  },
  head() {
    return {
      title: `${this.$t('title')} - ${this.$tc('client', 2)}`,
    };
  },
  computed: {
    clients(): Client[] {
      return this.filteredList;
    },
  },
  watch: {
    'store.Clients'() {
      this.filteredList = this.store.Clients;
    },
  },
  mounted() {
    this.getClients();
  },
  methods: {
    async getClients() {
      this.isLoading = true;
      await this.store.getClients();
      this.isLoading = false;
    },
    create() {
      const name = `${this.$t('clients.new_firstname')} ${this.$t(
        'clients.new_lastname'
      )}`;
      this.store.createLocalClient(name);
    },
    onFilterChanged(filteredList: Client[]) {
      this.filteredList = filteredList;
    },
  },
});
</script>
