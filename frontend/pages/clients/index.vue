<template>
  <div class="row">
    <div class="col text-center">
      <button class="btn btn-primary px-5 font-weight-bold">
        Create new client
      </button>
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <div v-for="client of clients" :key="client.id" class="mb-2">
          <Client :client="client" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import ClientModule from '~/store/client';
import { Client } from '~/models/client';

export default Vue.extend({
  name: 'ClientsPage',
  data() {
    return {
      store: getModule(ClientModule, this.$store),
      isLoading: false,
    };
  },
  computed: {
    clients(): Client[] {
      return this.store.Clients;
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
  },
});
</script>
