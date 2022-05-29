<template>
  <AppItem
    :delete-disbaled="getDocumentsLength(client) > 0"
    @edit="edit"
    @cancel="cancel"
    @save="save"
    @delete="deleteClient"
  >
    <template #header>
      <div class="d-flex align-items-center">
        <font-awesome-icon
          class="me-2"
          :icon="[
            'fa',
            getClientType(client) === ClientType.COMPANY ? 'user-tie' : 'user',
          ]"
        />
        <div class="d-flex">
          <div>
            {{ fullname }}
          </div>
          <div
            v-if="getClientType(client) === ClientType.COMPANY"
            class="d-none d-lg-block ms-1"
          >
            {{ ' | ' + company }}
          </div>
        </div>
        <div class="ms-2 id">#{{ client.id }}</div>
      </div>
    </template>
    <template #action>
      <NuxtLink
        :to="'/documents/create?client=' + client.id"
        class="btn btn-link"
      >
        <font-awesome-icon :icon="['fas', 'file-signature']" />
      </NuxtLink>
    </template>
    <template #body>
      <div class="container">
        <div v-if="client.createdAt && client.updatedAt" class="row mb-2">
          <div class="col-sm-6 id text-center">
            {{ $t('common.createdAt') }}
            {{ getDate(client.createdAt, DateTimeFormat.FULL) }}
          </div>
          <div class="col-sm-6 id text-center">
            {{ $t('common.updatedAt') }}
            {{ getDate(client.updatedAt, DateTimeFormat.FULL) }}
          </div>
        </div>
        <ClientForm
          :value="mutableClient"
          :client-type="getClientType(mutableClient)"
          :view-mode="viewMode"
          @input="(e) => (mutableClient = e)"
        ></ClientForm>
      </div>
    </template>
  </AppItem>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import ClientModule from '~/store/client';
import { Client } from '~/models';
import { DateTimeFormat, ViewMode, ClientType } from '~/types';
import {
  getDate,
  getClientType,
  getMutableClient,
  getDocumentsLength,
} from '~/utils/helper';

export default Vue.extend({
  name: 'ClientItemComponent',
  props: {
    client: {
      type: Object as () => Client,
      required: true,
    },
  },
  data() {
    return {
      DateTimeFormat,
      ClientType,
      getDate,
      getClientType,
      getDocumentsLength,
      viewMode: ViewMode.SHOW,
      store: getModule(ClientModule, this.$store),
      mutableClient: {} as Client,
    };
  },
  computed: {
    fullname(): string {
      return `${this.mutableClient.firstname} ${this.mutableClient.lastname}`;
    },
    company(): string {
      return `${this.mutableClient.company} - VAT. ${this.mutableClient.vat}`;
    },
  },
  mounted() {
    this.setClient();
  },
  methods: {
    setClient() {
      this.mutableClient = getMutableClient(this.client);
    },
    edit(viewMode: ViewMode) {
      this.viewMode = viewMode;
    },
    save(viewMode: ViewMode) {
      this.viewMode = viewMode;

      if (this.mutableClient.id === '1')
        this.store.createClient(this.mutableClient);
      else this.store.updateClient(this.mutableClient);
    },
    cancel(viewMode: ViewMode) {
      this.viewMode = viewMode;
      this.setClient();
    },
    deleteClient() {
      this.store.deleteClient(this.mutableClient);
    },
  },
});
</script>

<style lang="scss" scoped>
.id {
  font-size: 0.7rem;
  opacity: 0.33;
}
</style>
