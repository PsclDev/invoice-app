<template>
  <AppCard
    :delete-disbaled="documentsLength > 0"
    @edit="edit"
    @cancel="cancel"
    @save="save"
    @delete="deleteClient"
  >
    <template #header>
      <div class="d-flex align-items-center">
        <font-awesome-icon
          class="me-2"
          :icon="['fa', isCompany() ? 'user-tie' : 'user']"
        />
        <div class="d-flex">
          <div>
            {{ fullname }}
          </div>
          <div v-if="isCompany()" class="d-none d-lg-block ms-1">
            {{ ' | ' + company }}
          </div>
        </div>
        <div class="ms-2 id">#{{ client.id }}</div>
      </div>
    </template>
    <template #body>
      <div class="container">
        <div v-if="client.createdAt && client.updatedAt" class="row mb-2">
          <div class="col-sm-6 id text-center">
            {{ $t('common.createdAt') }}
            {{ getDate(client.createdAt, true) }}
          </div>
          <div class="col-sm-6 id text-center">
            {{ $t('common.updatedAt') }}
            {{ getDate(client.updatedAt, true) }}
          </div>
        </div>
        <template v-if="isCompany() || viewMode === ViewMode.EDIT">
          <div class="row mb-4">
            <App-Input
              v-model="mutableClient.company"
              class="col-sm-4 mb-3 mb-sm-0"
              :title="$t('clients.company')"
              :view-mode="viewMode"
            ></App-Input>
            <App-Input
              v-model="mutableClient.vat"
              class="col-sm-4"
              :title="$t('clients.vat')"
              :view-mode="viewMode"
            ></App-Input>
          </div>
        </template>
        <div class="row mb-4">
          <App-Gender-Select
            v-if="mutableClient.gender"
            v-model="mutableClient.gender"
            class="col-sm-4 mb-3 mb-sm-0"
            :title="$t('clients.gender')"
            :view-mode="viewMode"
          ></App-Gender-Select>
          <App-Input
            v-model="mutableClient.firstname"
            class="col-sm-4 mb-3 mb-sm-0"
            :title="$t('clients.firstname')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-model="mutableClient.lastname"
            class="col-sm-4"
            :title="$t('clients.lastname')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableClient.street"
            class="col-sm-4 mb-3 mb-sm-0"
            :title="$t('clients.street')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-model="mutableClient.postalCode"
            class="col-sm-4 mb-3 mb-sm-0"
            :title="$t('clients.postalCode')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-model="mutableClient.city"
            class="col-sm-4"
            :title="$t('clients.city')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableClient.email"
            class="col-sm-4"
            :view-mode="viewMode"
            :title="$t('clients.email')"
            type="email"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <div class="col-8 col-sm-4">
            <div v-if="documentsLength === 0" class="d-flex align-items-center">
              <font-awesome-icon class="me-2" :icon="['fa', 'file-pdf']" />
              <div>
                {{ documentsLength }}
                {{ $tc('document', 2) }}
              </div>
            </div>
            <AppCollapse v-else>
              <template #header>
                <div class="d-flex align-items-center">
                  <font-awesome-icon class="me-2" :icon="['fa', 'file-pdf']" />
                  <div>
                    {{ documentsLength }}
                    {{ $tc('document', documentsLength === 1 ? 1 : 2) }}
                  </div>
                </div>
              </template>
              <template #body>
                <ul>
                  <li v-for="doc of documents" :key="doc.id">
                    <NuxtLink :to="'/pdf/' + doc.id">
                      {{ getDocumentTitle(doc) }}
                    </NuxtLink>
                  </li>
                </ul>
              </template>
            </AppCollapse>
          </div>
        </div>
      </div>
    </template>
  </AppCard>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import ClientModule from '~/store/client';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import ViewMode from '~/types/viewMode';

export default Vue.extend({
  name: 'ClientComponent',
  props: {
    client: {
      type: Object as () => Client,
      required: true,
    },
  },
  data() {
    return {
      ViewMode,
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
    documents(): Document[] {
      return this.client.documents;
    },
    documentsLength(): number {
      return this.client.documents ? this.client.documents.length : 0;
    },
  },
  mounted() {
    this.setClient();
  },
  methods: {
    setClient() {
      this.mutableClient = {
        id: this.client.id,
        company: this.client.company,
        vat: this.client.vat,
        gender: this.client.gender,
        firstname: this.client.firstname,
        lastname: this.client.lastname,
        email: this.client.email,
        street: this.client.street,
        postalCode: this.client.postalCode,
        city: this.client.city,
      } as Client;
    },
    isCompany() {
      return this.client.company;
    },
    getDocumentTitle(doc: Document) {
      if (doc.invoiceNr) {
        return `${this.$t('documents.invoice')} #${String(
          doc.invoiceNr
        ).padStart(4, '0')}`;
      }
      return `${this.$t('documents.offer')} ${this.getDate(doc.dateOfIssue)}`;
    },
    getDate(date: Date, withTime: boolean = false) {
      return this.$dayjs(date).format(
        withTime ? 'DD.MM.YYYY HH:MM:ss' : 'DD.MM.YYYY'
      );
    },
    edit(viewMode: ViewMode) {
      this.viewMode = viewMode;
    },
    save(viewMode: ViewMode) {
      this.viewMode = viewMode;
      if (this.mutableClient.id) this.store.updateClient(this.mutableClient);
      else this.store.saveNewClient(this.mutableClient);
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
